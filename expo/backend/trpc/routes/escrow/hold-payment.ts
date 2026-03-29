import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const holdPaymentProcedure = publicProcedure
  .input(z.object({
    bookingId: z.string(),
    amount: z.number().positive(),
    currency: z.string().default('KES'),
  }))
  .mutation(async ({ input, ctx }) => {
    const { bookingId, amount, currency } = input;

    console.log(`[Escrow] Holding payment for booking: ${bookingId}`, { amount, currency });

    return {
      bookingId,
      amount,
      currency,
      status: 'held' as const,
      heldAt: new Date().toISOString(),
      releaseScheduled: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  });
