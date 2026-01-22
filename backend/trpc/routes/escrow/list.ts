import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { EscrowPayment } from "../../../db/schema";

export const listEscrowProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      role: z.enum(["payer", "payee"]).optional(),
    })
  )
  .query(async ({ input }): Promise<EscrowPayment[]> => {
    console.log("💰 Fetching escrow payments for user:", input.userId);

    const mockEscrows: EscrowPayment[] = [
      {
        id: "escrow_1",
        bookingId: "booking_101",
        payerId: input.userId,
        payeeId: "landlord_789",
        amount: 10000,
        currency: "KES",
        status: "held",
        heldAt: new Date(Date.now() - 86400000 * 2),
        releaseScheduledAt: new Date(Date.now() + 86400000 * 5),
        metadata: {},
      },
      {
        id: "escrow_2",
        bookingId: "booking_102",
        payerId: "user_456",
        payeeId: input.userId,
        amount: 15000,
        currency: "KES",
        status: "released",
        heldAt: new Date(Date.now() - 86400000 * 10),
        releasedAt: new Date(Date.now() - 86400000 * 3),
        metadata: {},
      },
    ];

    return mockEscrows;
  });
