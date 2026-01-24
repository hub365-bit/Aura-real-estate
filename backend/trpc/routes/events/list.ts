import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const listEventsProcedure = publicProcedure
  .input(z.object({
    category: z.enum(['conference', 'training', 'religious', 'social', 'other']).optional(),
    city: z.string().optional(),
  }))
  .query(async ({ input, ctx }) => {
    const { category, city } = input;

    console.log(`[Events] Listing`, { category, city });

    return {
      events: [],
      total: 0,
    };
  });
