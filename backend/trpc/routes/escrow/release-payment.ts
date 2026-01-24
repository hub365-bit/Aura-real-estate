import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const releasePaymentProcedure = publicProcedure
  .input(z.object({
    bookingId: z.string(),
    amount: z.number().positive().optional(),
  }))
  .mutation(async ({ input, ctx }) => {
    const { bookingId, amount } = input;

    console.log(`[Escrow] Releasing payment for booking: ${bookingId}`, { amount });

    return {
      success: true,
      releasedAt: new Date().toISOString(),
      message: 'Payment released to provider',
    };
  });
