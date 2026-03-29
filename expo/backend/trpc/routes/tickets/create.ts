import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";
import { ticketTypeSchema } from "../../../db/schema";

export const createTicketProcedure = protectedProcedure
  .input(
    z.object({
      propertyId: z.string().optional(),
      type: ticketTypeSchema,
      title: z.string().min(5),
      description: z.string().min(10),
      priority: z.enum(["low", "medium", "high"]).default("medium"),
      images: z.array(z.string()).default([]),
      videos: z.array(z.string()).default([]),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const ticket = db.createTicket({
      id: generateId(),
      userId: ctx.userId,
      propertyId: input.propertyId,
      type: input.type,
      title: input.title,
      description: input.description,
      status: "open",
      priority: input.priority,
      images: input.images,
      videos: input.videos,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    db.createNotification({
      id: generateId(),
      userId: ctx.userId,
      type: "ticket",
      title: "Ticket Created",
      message: `Your ${input.type} ticket has been created. Ticket ID: ${ticket.id}`,
      read: false,
      createdAt: new Date(),
    });

    return {
      success: true,
      ticket,
    };
  });

function generateId(): string {
  return `ticket-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}
