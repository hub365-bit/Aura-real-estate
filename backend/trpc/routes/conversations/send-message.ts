import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { Message, messageTypeSchema } from "../../../db/schema";

export const sendMessageProcedure = publicProcedure
  .input(
    z.object({
      conversationId: z.string(),
      senderId: z.string(),
      receiverId: z.string(),
      type: messageTypeSchema,
      content: z.string(),
      mediaUrl: z.string().optional(),
      propertyId: z.string().optional(),
      bookingId: z.string().optional(),
    })
  )
  .mutation(async ({ input }): Promise<Message> => {
    console.log("💬 Sending message:", input);

    const message: Message = {
      id: `msg_${Date.now()}`,
      conversationId: input.conversationId,
      senderId: input.senderId,
      receiverId: input.receiverId,
      propertyId: input.propertyId,
      bookingId: input.bookingId,
      type: input.type,
      content: input.content,
      mediaUrl: input.mediaUrl,
      read: false,
      delivered: true,
      createdAt: new Date(),
    };

    console.log("✅ Message sent successfully");
    return message;
  });
