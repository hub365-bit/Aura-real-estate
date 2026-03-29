import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const listConversationsProcedure = publicProcedure
  .input(z.object({
    userId: z.string(),
  }))
  .query(async ({ input, ctx }) => {
    const { userId } = input;

    console.log(`[Conversations] Listing for user: ${userId}`);

    return {
      conversations: [],
      total: 0,
    };
  });
