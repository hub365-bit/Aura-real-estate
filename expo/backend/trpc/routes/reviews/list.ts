import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";

export const listReviewsProcedure = publicProcedure
  .input(
    z.object({
      propertyId: z.string().optional(),
      serviceId: z.string().optional(),
      businessId: z.string().optional(),
    })
  )
  .query(async ({ input }) => {
    const reviews = db.getReviews(input);

    return {
      reviews,
      total: reviews.length,
    };
  });
