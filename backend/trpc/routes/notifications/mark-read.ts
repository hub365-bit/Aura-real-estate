import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";

export const markNotificationReadProcedure = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const notification = db.markNotificationRead(input.id);

    return {
      success: true,
      notification,
    };
  });
