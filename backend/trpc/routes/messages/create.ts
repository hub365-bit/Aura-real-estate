import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";

export const createMessageProcedure = protectedProcedure
  .input(
    z.object({
      receiverId: z.string(),
      propertyId: z.string().optional(),
      content: z.string().min(1),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const message = db.createMessage({
      id: generateId(),
      senderId: ctx.userId,
      receiverId: input.receiverId,
      propertyId: input.propertyId,
      content: input.content,
      read: false,
      createdAt: new Date(),
    });

    db.createNotification({
      id: generateId(),
      userId: input.receiverId,
      type: "general",
      title: "New Message",
      message: "You have a new message",
      data: { messageId: message.id },
      read: false,
      createdAt: new Date(),
    });

    return {
      success: true,
      message,
    };
  });

function generateId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}
