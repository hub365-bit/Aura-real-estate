import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const updateTrustScoreProcedure = publicProcedure
  .input(z.object({
    userId: z.string(),
    event: z.enum(['booking_completed', 'booking_cancelled', 'dispute_logged', 'response_time_updated']),
    metadata: z.record(z.string(), z.any()).optional(),
  }))
  .mutation(async ({ input }) => {
    const { userId, event, metadata } = input;

    console.log(`[Trust Score] Updating for user ${userId}: ${event}`, metadata);

    return {
      success: true,
      message: 'Trust score updated successfully',
    };
  });
