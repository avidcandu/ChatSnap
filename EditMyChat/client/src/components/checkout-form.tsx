import { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PricingTier, pricingConfig } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft } from "lucide-react";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error("Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY");
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  tier: PricingTier;
  onBack: () => void;
  onSuccess: () => void;
}

function CheckoutFormInner({ tier, onBack, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      if (!paymentIntent) {
        toast({
          title: "Error",
          description: "No payment intent returned",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Verify payment succeeded
      if (paymentIntent.status !== "succeeded") {
        toast({
          title: "Payment Failed",
          description: "Payment was not completed successfully",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Send payment intent ID to backend for secure verification
      const response = await apiRequest("POST", "/api/confirm-payment", {
        paymentIntentId: paymentIntent.id,
      });

      if (response.ok) {
        await queryClient.invalidateQueries({ queryKey: ["/api/session"] });
        toast({
          title: "Payment Successful",
          description: `Your ${pricingConfig[tier].name} plan has been activated!`,
        });
        onSuccess();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to activate plan",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isProcessing}
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1"
          data-testid="button-pay"
        >
          {isProcessing
            ? "Processing..."
            : `Pay $${pricingConfig[tier].price.toFixed(2)}`}
        </Button>
      </div>
    </form>
  );
}

export function CheckoutForm({ tier, onBack, onSuccess }: CheckoutFormProps) {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await apiRequest("POST", "/api/create-payment-intent", {
          tier,
          amount: pricingConfig[tier].price,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to initialize payment",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [tier, toast]);

  if (loading || !clientSecret) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div
          className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
          aria-label="Loading"
        />
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutFormInner tier={tier} onBack={onBack} onSuccess={onSuccess} />
    </Elements>
  );
}
