import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";
import { subscriptionTierSchema } from "../../../db/schema";

export const createSubscriptionProcedure = protectedProcedure
  .input(
    z.object({
      tier: subscriptionTierSchema,
      category: z.enum(["hospitality", "service_provider", "property_seller", "boost"]),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const prices = {
      hospitality: { weekly: 1500, monthly: 5000, yearly: 55000 },
      service_provider: { weekly: 300, monthly: 1000, yearly: 11000 },
      property_seller: { weekly: 300, monthly: 1000, yearly: 11000 },
      boost: { weekly: 200, monthly: 800, yearly: 8000 },
    };

    const durations = {
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    const price = input.tier === "free" ? 0 : prices[input.category][input.tier as keyof typeof prices.hospitality];
    const days = input.tier === "free" ? 0 : durations[input.tier as keyof typeof durations];

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    const subscription = db.createSubscription({
      id: generateId(),
      userId: ctx.userId,
      tier: input.tier,
      category: input.category,
      price,
      currency: "KSh",
      startDate,
      endDate,
      autoRenew: true,
      active: true,
      createdAt: new Date(),
    });

    return {
      success: true,
      subscription,
    };
  });

function generateId(): string {
  return `sub-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}
