import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const disputeEscrowProcedure = publicProcedure
  .input(z.object({
    bookingId: z.string(),
    reason: z.string(),
    evidence: z.array(z.string()).optional(),
  }))
  .mutation(async ({ input, ctx }) => {
    const { bookingId, reason, evidence } = input;

    console.log(`[Escrow] Dispute raised for booking: ${bookingId}`, { reason });

    return {
      success: true,
      status: 'disputed' as const,
      message: 'Dispute submitted for admin review',
    };
  });
