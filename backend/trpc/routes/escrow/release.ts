import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { EscrowPayment } from "../../../db/schema";

export const releaseEscrowProcedure = publicProcedure
  .input(
    z.object({
      escrowId: z.string(),
      adminId: z.string().optional(),
    })
  )
  .mutation(async ({ input }): Promise<EscrowPayment> => {
    console.log("💰 Releasing escrow payment:", input.escrowId);

    const escrowPayment: EscrowPayment = {
      id: input.escrowId,
      bookingId: "booking_123",
      payerId: "user_123",
      payeeId: "landlord_456",
      amount: 5000,
      currency: "KES",
      status: "released",
      heldAt: new Date(Date.now() - 86400000 * 7),
      releasedAt: new Date(),
      metadata: { releasedBy: input.adminId || "auto" },
    };

    console.log("✅ Escrow payment released successfully");
    return escrowPayment;
  });
