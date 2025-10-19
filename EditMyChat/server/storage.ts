import { type Session, type InsertSession, type PricingTier } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getSession(id: string): Promise<Session | undefined>;
  createSession(session?: Partial<InsertSession>): Promise<Session>;
  updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined>;
  incrementScreenshotUsage(id: string): Promise<Session | undefined>;
  setPendingPayment(id: string, paymentIntentId: string, tier: PricingTier): Promise<Session | undefined>;
  activatePlan(id: string, paymentIntentId: string): Promise<Session | undefined>;
}

export class MemStorage implements IStorage {
  private sessions: Map<string, Session>;

  constructor() {
    this.sessions = new Map();
  }

  async getSession(id: string): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async createSession(session?: Partial<InsertSession>): Promise<Session> {
    const id = randomUUID();
    const newSession: Session = {
      id,
      createdAt: new Date(),
      screenshotsUsed: session?.screenshotsUsed ?? 0,
      screenshotLimit: session?.screenshotLimit ?? 3,
      isUnlimited: session?.isUnlimited ?? false,
      pendingPaymentIntentId: null,
      pendingTier: null,
    };
    this.sessions.set(id, newSession);
    return newSession;
  }

  async updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (!session) {
      return undefined;
    }
    const updated = { ...session, ...updates };
    this.sessions.set(id, updated);
    return updated;
  }

  async incrementScreenshotUsage(id: string): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (!session) {
      return undefined;
    }
    const updated = { ...session, screenshotsUsed: session.screenshotsUsed + 1 };
    this.sessions.set(id, updated);
    return updated;
  }

  async setPendingPayment(id: string, paymentIntentId: string, tier: PricingTier): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (!session) {
      return undefined;
    }
    const updated = {
      ...session,
      pendingPaymentIntentId: paymentIntentId,
      pendingTier: tier,
    };
    this.sessions.set(id, updated);
    return updated;
  }

  async activatePlan(id: string, paymentIntentId: string): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (!session) {
      return undefined;
    }

    // Verify this is the expected payment
    if (session.pendingPaymentIntentId !== paymentIntentId) {
      return undefined;
    }

    if (!session.pendingTier) {
      return undefined;
    }

    // Import pricingConfig here to avoid circular dependency
    const { pricingConfig } = await import("@shared/schema");
    const tier = session.pendingTier as keyof typeof pricingConfig;
    const config = pricingConfig[tier];

    // Set the new plan limits - REPLACE the existing limits, don't add
    const updated: Session = {
      ...session,
      screenshotsUsed: 0, // Reset usage when activating new plan
      screenshotLimit: config.screenshots === -1 ? 0 : config.screenshots, // 0 for unlimited since isUnlimited will be true
      isUnlimited: config.screenshots === -1,
      pendingPaymentIntentId: null,
      pendingTier: null,
    };

    this.sessions.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
