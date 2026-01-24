import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const bookEventTicketProcedure = publicProcedure
  .input(z.object({
    eventId: z.string(),
    userId: z.string(),
    quantity: z.number().positive().default(1),
  }))
  .mutation(async ({ input, ctx }) => {
    const { eventId, userId, quantity } = input;

    const ticketId = `tkt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const qrCode = `QR_${ticketId}`;

    console.log(`[Event Ticket] Booked: ${ticketId}`, { eventId, userId, quantity });

    return {
      id: ticketId,
      eventId,
      userId,
      qrCode,
      status: 'valid' as const,
      purchasedAt: new Date().toISOString(),
    };
  });
