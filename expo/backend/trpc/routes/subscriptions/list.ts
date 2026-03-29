import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";

export const listSubscriptionsProcedure = protectedProcedure
  .input(
    z.object({
      userId: z.string().optional(),
    })
  )
  .query(async ({ ctx, input }) => {
    const subscriptions = db.getSubscriptions(input.userId || ctx.userId);

    return {
      subscriptions,
      total: subscriptions.length,
    };
  });
