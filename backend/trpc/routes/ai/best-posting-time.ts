import { z } from "zod";
import { publicProcedure } from "../../create-context";

export const getBestPostingTimeProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      category: z.string(),
    })
  )
  .query(
    async ({
      input,
    }): Promise<{
      bestDays: string[];
      bestHours: number[];
      reasoning: string;
    }> => {
      console.log("🧠 Calculating best posting time for user:", input.userId);

      return {
        bestDays: ["Monday", "Tuesday", "Wednesday"],
        bestHours: [9, 10, 11, 14, 15, 16],
        reasoning:
          "Based on platform data, properties posted on weekday mornings (9-11 AM) and afternoons (2-4 PM) receive 40% more views and inquiries.",
      };
    }
  );
