import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { pricingConfig, pricingTierSchema, type PricingTier } from "@shared/schema";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing required Stripe secret: STRIPE_SECRET_KEY");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get or create session
  app.get("/api/session", async (req, res) => {
    try {
      let sessionId = req.cookies?.sessionId;
      let session;

      if (sessionId) {
        session = await storage.getSession(sessionId);
      }

      if (!session) {
        session = await storage.createSession();
        res.cookie("sessionId", session.id, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
          sameSite: "lax",
        });
      }

      res.json(session);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching session: " + error.message });
    }
  });

  // Increment screenshot usage
  app.post("/api/screenshot/use", async (req, res) => {
    try {
      const sessionId = req.cookies?.sessionId;
      if (!sessionId) {
        return res.status(400).json({ message: "No session found" });
      }

      const session = await storage.getSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      if (!session.isUnlimited && session.screenshotsUsed >= session.screenshotLimit) {
        return res.status(403).json({ message: "Screenshot limit reached" });
      }

      const updated = await storage.incrementScreenshotUsage(sessionId);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: "Error using screenshot: " + error.message });
    }
  });

  // Stripe payment route for one-time payments
  // Stores the tier server-side to prevent tampering
  // Only allows one pending payment at a time
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { tier } = req.body;

      const result = pricingTierSchema.safeParse(tier);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid pricing tier" });
      }

      const sessionId = req.cookies?.sessionId;
      if (!sessionId) {
        return res.status(400).json({ message: "No session found" });
      }

      const session = await storage.getSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      // Check if there's already a pending payment
      if (session.pendingPaymentIntentId) {
        // Verify if the pending payment is still valid
        try {
          const existingIntent = await stripe.paymentIntents.retrieve(
            session.pendingPaymentIntentId
          );
          
          // If the existing intent is still in a processing state, reject new payment
          if (
            existingIntent.status === "requires_payment_method" ||
            existingIntent.status === "requires_confirmation" ||
            existingIntent.status === "requires_action" ||
            existingIntent.status === "processing"
          ) {
            return res.status(400).json({ 
              message: "A payment is already in progress. Please complete or cancel it first." 
            });
          }
        } catch (error) {
          // If we can't retrieve the intent, it might be deleted/expired, so we can continue
        }
      }

      // Use server-determined amount based on tier (never trust client)
      const config = pricingConfig[result.data];
      const amount = config.price;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          sessionId,
          tier: result.data,
        },
      });

      // Store the pending payment and tier server-side
      // This locks the tier for this payment intent
      await storage.setPendingPayment(sessionId, paymentIntent.id, result.data);

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Confirm payment and upgrade session - FULLY SECURED VERSION
  // This endpoint validates the payment with Stripe and uses server-side stored tier
  app.post("/api/confirm-payment", async (req, res) => {
    try {
      const { paymentIntentId } = req.body;
      const sessionId = req.cookies?.sessionId;

      if (!sessionId) {
        return res.status(400).json({ message: "No session found" });
      }

      if (!paymentIntentId) {
        return res.status(400).json({ message: "Payment intent ID required" });
      }

      // Get the session to check pending payment
      const session = await storage.getSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      // Verify this payment was initiated by this session
      if (session.pendingPaymentIntentId !== paymentIntentId) {
        return res.status(403).json({ 
          message: "Payment intent not associated with this session" 
        });
      }

      if (!session.pendingTier) {
        return res.status(400).json({ message: "No pending tier found" });
      }

      // Retrieve the payment intent from Stripe to validate it
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      // Validate payment status
      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({ message: "Payment not completed" });
      }

      // Validate session ID matches (double-check)
      if (paymentIntent.metadata.sessionId !== sessionId) {
        return res.status(403).json({ message: "Payment session mismatch" });
      }

      // Use the server-stored tier (not from client or metadata)
      // This is the tier that was locked when creating the payment intent
      const tier = session.pendingTier as PricingTier;
      const config = pricingConfig[tier];
      if (!config) {
        return res.status(400).json({ message: "Invalid tier" });
      }

      // Validate amount matches the server-stored tier's price
      // This ensures the user paid the correct amount for the tier they're getting
      const expectedAmount = Math.round(config.price * 100); // in cents
      if (paymentIntent.amount !== expectedAmount) {
        return res.status(400).json({ 
          message: "Payment amount does not match tier price" 
        });
      }

      // All validations passed - activate the plan using server-side tier
      const updatedSession = await storage.activatePlan(sessionId, paymentIntentId);
      if (!updatedSession) {
        return res.status(500).json({ message: "Failed to activate plan" });
      }

      res.json(updatedSession);
    } catch (error: any) {
      res.status(500).json({ message: "Error confirming payment: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
