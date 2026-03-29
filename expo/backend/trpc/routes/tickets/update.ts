import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";
import { TRPCError } from "@trpc/server";
import { ticketStatusSchema } from "../../../db/schema";

export const updateTicketProcedure = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      status: ticketStatusSchema.optional(),
      assignedTo: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    const ticket = db.getTicket(input.id);
    
    if (!ticket) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Ticket not found",
      });
    }

    const { id, ...updates } = input;
    const updatedTicket = db.updateTicket(id, {
      ...updates,
      resolvedAt: input.status === "resolved" || input.status === "closed" ? new Date() : undefined,
    });

    if (input.status === "closed" && ticket.type === "vacate" && ticket.propertyId) {
      const property = db.getProperty(ticket.propertyId);
      if (property) {
        db.updateProperty(property.id, { available: true });
      }
    }

    return {
      success: true,
      ticket: updatedTicket,
    };
  });
