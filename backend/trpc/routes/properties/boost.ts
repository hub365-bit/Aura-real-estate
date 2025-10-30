import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";
import { TRPCError } from "@trpc/server";

export const boostPropertyProcedure = protectedProcedure
  .input(
    z.object({
      propertyId: z.string(),
      duration: z.enum(["weekly", "monthly", "yearly"]),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const property = db.getProperty(input.propertyId);
    
    if (!property) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Property not found",
      });
    }

    if (property.userId !== ctx.userId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You don't have permission to boost this property",
      });
    }

    const prices = {
      weekly: 200,
      monthly: 800,
      yearly: 8000,
    };

    const durations = {
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    const price = prices[input.duration];
    const days = durations[input.duration];
    
    const boostExpiresAt = new Date();
    boostExpiresAt.setDate(boostExpiresAt.getDate() + days);

    db.updateProperty(property.id, {
      boosted: true,
      boostExpiresAt,
    });

    return {
      success: true,
      message: `Property boosted for ${input.duration}`,
      price,
      expiresAt: boostExpiresAt,
    };
  });
