import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { EscrowPayment } from "../../../db/schema";

export const disputeEscrowProcedure = publicProcedure
  .input(
    z.object({
      escrowId: z.string(),
      userId: z.string(),
      reason: z.string(),
    })
  )
  .mutation(async ({ input }): Promise<EscrowPayment> => {
    console.log("⚠️ Disputing escrow payment:", input);

    const escrowPayment: EscrowPayment = {
      id: input.escrowId,
      bookingId: "booking_123",
      payerId: "user_123",
      payeeId: "landlord_456",
      amount: 5000,
      currency: "KES",
      status: "disputed",
      heldAt: new Date(Date.now() - 86400000 * 3),
      disputeReason: input.reason,
      disputedAt: new Date(),
      metadata: { disputedBy: input.userId },
    };

    console.log("✅ Escrow payment disputed");
    return escrowPayment;
  });
