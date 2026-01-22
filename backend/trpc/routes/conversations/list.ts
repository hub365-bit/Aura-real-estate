import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { Conversation } from "../../../db/schema";

export const listConversationsProcedure = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }): Promise<Conversation[]> => {
    console.log("💬 Fetching conversations for user:", input.userId);

    const mockConversations: Conversation[] = [
      {
        id: "conv_1",
        participants: [input.userId, "agent_123"],
        propertyId: "prop_456",
        lastMessage: "Is this property still available?",
        lastMessageAt: new Date(),
        unreadCount: { [input.userId]: 1 },
        typing: [],
        createdAt: new Date(Date.now() - 86400000),
      },
      {
        id: "conv_2",
        participants: [input.userId, "landlord_789"],
        bookingId: "booking_101",
        lastMessage: "Thank you for booking!",
        lastMessageAt: new Date(Date.now() - 3600000),
        unreadCount: { [input.userId]: 0 },
        typing: [],
        createdAt: new Date(Date.now() - 172800000),
      },
    ];

    return mockConversations;
  });
