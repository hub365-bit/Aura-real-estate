import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";

export const listPaymentsProcedure = protectedProcedure
  .input(
    z.object({
      userId: z.string().optional(),
    })
  )
  .query(async ({ ctx, input }) => {
    const payments = db.getPayments(input.userId || ctx.userId);

    return {
      payments,
      total: payments.length,
    };
  });
