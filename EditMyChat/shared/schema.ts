import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  screenshotsUsed: integer("screenshots_used").notNull().default(0),
  screenshotLimit: integer("screenshot_limit").notNull().default(3),
  isUnlimited: boolean("is_unlimited").notNull().default(false),
  pendingPaymentIntentId: text("pending_payment_intent_id"),
  pendingTier: text("pending_tier"),
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  createdAt: true,
});

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;

export const platformSchema = z.enum(["whatsapp", "instagram", "discord", "telegram"]);
export type Platform = z.infer<typeof platformSchema>;

export const messageTypeSchema = z.enum(["sent", "received"]);
export type MessageType = z.infer<typeof messageTypeSchema>;

export const messageSchema = z.object({
  id: z.string(),
  type: messageTypeSchema,
  sender: z.string(),
  text: z.string(),
  timestamp: z.string(),
  avatar: z.string().optional(),
  isRead: z.boolean().default(true),
});

export type Message = z.infer<typeof messageSchema>;

export const pricingTierSchema = z.enum(["starter", "pro", "unlimited"]);
export type PricingTier = z.infer<typeof pricingTierSchema>;

export const pricingConfig = {
  starter: {
    name: "Starter",
    price: 3.99,
    screenshots: 15,
    description: "Perfect for occasional use",
    popular: true,
  },
  pro: {
    name: "Pro",
    price: 6.99,
    screenshots: 25,
    description: "Great for regular creators",
    popular: false,
  },
  unlimited: {
    name: "Unlimited",
    price: 15.99,
    screenshots: -1,
    description: "No limits, create freely",
    popular: false,
  },
} as const;
