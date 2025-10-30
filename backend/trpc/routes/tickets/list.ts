import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";
import { ticketStatusSchema } from "../../../db/schema";

export const listTicketsProcedure = protectedProcedure
  .input(
    z.object({
      userId: z.string().optional(),
      assignedTo: z.string().optional(),
      status: ticketStatusSchema.optional(),
    })
  )
  .query(async ({ ctx, input }) => {
    const tickets = db.getTickets({
      userId: input.userId || ctx.userId,
      assignedTo: input.assignedTo,
      status: input.status,
    });

    return {
      tickets,
      total: tickets.length,
    };
  });
