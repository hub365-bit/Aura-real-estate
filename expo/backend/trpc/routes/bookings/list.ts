import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";

export const listBookingsProcedure = protectedProcedure
  .input(
    z.object({
      userId: z.string().optional(),
    })
  )
  .query(async ({ ctx, input }) => {
    const bookings = db.getBookings(input.userId || ctx.userId);

    return {
      bookings,
      total: bookings.length,
    };
  });
