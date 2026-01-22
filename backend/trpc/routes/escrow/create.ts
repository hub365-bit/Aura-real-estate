import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { EscrowPayment } from "../../../db/schema";

export const createEscrowProcedure = publicProcedure
  .input(
    z.object({
      bookingId: z.string(),
      payerId: z.string(),
      payeeId: z.string(),
      amount: z.number(),
      currency: z.string(),
      releaseScheduledAt: z.date().optional(),
    })
  )
  .mutation(async ({ input }): Promise<EscrowPayment> => {
    console.log("💰 Creating escrow payment:", input);

    const escrowPayment: EscrowPayment = {
      id: `escrow_${Date.now()}`,
      bookingId: input.bookingId,
      payerId: input.payerId,
      payeeId: input.payeeId,
      amount: input.amount,
      currency: input.currency,
      status: "held",
      heldAt: new Date(),
      releaseScheduledAt: input.releaseScheduledAt,
      metadata: {},
    };

    console.log("✅ Escrow payment created successfully");
    return escrowPayment;
  });
