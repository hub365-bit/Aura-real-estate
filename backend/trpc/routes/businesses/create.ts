import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";

export const createBusinessProcedure = protectedProcedure
  .input(
    z.object({
      name: z.string().min(2),
      description: z.string().min(10),
      category: z.string(),
      logo: z.string().optional(),
      coverImage: z.string().optional(),
      location: z.object({
        address: z.string(),
        lat: z.number(),
        lng: z.number(),
      }),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const business = db.createBusiness({
      id: generateId(),
      userId: ctx.userId,
      name: input.name,
      description: input.description,
      category: input.category,
      logo: input.logo,
      coverImage: input.coverImage,
      location: input.location,
      followers: 0,
      rating: 0,
      reviewCount: 0,
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      success: true,
      business,
    };
  });

function generateId(): string {
  return `biz-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}
