import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";

export const listBusinessesProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string().optional(),
    })
  )
  .query(async ({ input }) => {
    const businesses = db.getBusinesses(input.userId);

    return {
      businesses,
      total: businesses.length,
    };
  });
