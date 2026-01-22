import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { EventTicket } from "../../../db/schema";

export const purchaseTicketProcedure = publicProcedure
  .input(
    z.object({
      eventId: z.string(),
      userId: z.string(),
      quantity: z.number().default(1),
    })
  )
  .mutation(async ({ input }): Promise<EventTicket> => {
    console.log("🎟️ Purchasing event ticket:", input);

    const ticket: EventTicket = {
      id: `ticket_${Date.now()}`,
      eventId: input.eventId,
      userId: input.userId,
      qrCode: `AURA-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
      purchaseDate: new Date(),
      status: "valid",
      escrowPaymentId: `escrow_${Date.now()}`,
    };

    console.log("✅ Ticket purchased successfully");
    return ticket;
  });
