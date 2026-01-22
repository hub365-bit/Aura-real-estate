import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { Message } from "../../../db/schema";

export const getMessagesProcedure = publicProcedure
  .input(
    z.object({
      conversationId: z.string(),
      limit: z.number().optional().default(50),
    })
  )
  .query(async ({ input }): Promise<Message[]> => {
    console.log("💬 Fetching messages for conversation:", input.conversationId);

    const mockMessages: Message[] = Array.from({ length: 5 }, (_, i) => ({
      id: `msg_${i}`,
      conversationId: input.conversationId,
      senderId: i % 2 === 0 ? "user_1" : "agent_1",
      receiverId: i % 2 === 0 ? "agent_1" : "user_1",
      type: "text" as const,
      content: `Sample message ${i + 1}`,
      read: i < 3,
      delivered: true,
      createdAt: new Date(Date.now() - i * 3600000),
    }));

    return mockMessages;
  });
