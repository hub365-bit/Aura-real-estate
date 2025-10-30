import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";
import { TRPCError } from "@trpc/server";

export const getBookingProcedure = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input }) => {
    const booking = db.getBooking(input.id);
    
    if (!booking) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Booking not found",
      });
    }

    return booking;
  });
