import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const sendMessageProcedure = publicProcedure
  .input(z.object({
    conversationId: z.string(),
    senderId: z.string(),
    receiverId: z.string(),
    content: z.string(),
    mediaUrls: z.array(z.string()).optional(),
    type: z.enum(['text', 'image', 'video']).default('text'),
  }))
  .mutation(async ({ input, ctx }) => {
    const { conversationId, senderId, receiverId, content, mediaUrls, type } = input;

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log(`[Message] Sent: ${messageId}`, { conversationId, senderId, receiverId });

    return {
      id: messageId,
      conversationId,
      senderId,
      receiverId,
      content,
      mediaUrls,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };
  });
