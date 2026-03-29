import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";

export const createReviewProcedure = protectedProcedure
  .input(
    z.object({
      propertyId: z.string().optional(),
      serviceId: z.string().optional(),
      businessId: z.string().optional(),
      rating: z.number().min(1).max(5),
      comment: z.string().min(10),
      images: z.array(z.string()).default([]),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const review = db.createReview({
      id: generateId(),
      userId: ctx.userId,
      propertyId: input.propertyId,
      serviceId: input.serviceId,
      businessId: input.businessId,
      rating: input.rating,
      comment: input.comment,
      images: input.images,
      verified: true,
      helpful: 0,
      createdAt: new Date(),
    });

    if (input.propertyId) {
      const property = db.getProperty(input.propertyId);
      if (property) {
        const reviews = db.getReviews({ propertyId: input.propertyId });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        db.updateProperty(input.propertyId, {
          rating: avgRating,
          reviewCount: reviews.length,
        });
      }
    }

    return {
      success: true,
      review,
    };
  });

function generateId(): string {
  return `review-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}
