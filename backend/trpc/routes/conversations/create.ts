import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const createConversationProcedure = publicProcedure
  .input(z.object({
    participantIds: z.array(z.string()).min(2),
    bookingId: z.string().optional(),
  }))
  .mutation(async ({ input, ctx }) => {
    const { participantIds, bookingId } = input;

    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log(`[Conversation] Created: ${conversationId}`, { participantIds, bookingId });

    return {
      id: conversationId,
      participants: participantIds,
      bookingId,
      unreadCount: 0,
      createdAt: new Date().toISOString(),
    };
  });
