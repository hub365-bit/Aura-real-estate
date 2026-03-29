import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";
import { propertyTypeSchema } from "../../../db/schema";

export const createPropertyProcedure = protectedProcedure
  .input(
    z.object({
      type: propertyTypeSchema,
      title: z.string().min(5),
      description: z.string().min(20),
      price: z.number().positive(),
      currency: z.string().default("KSh"),
      category: z.string(),
      location: z.object({
        address: z.string(),
        lat: z.number(),
        lng: z.number(),
        area: z.string(),
        city: z.string(),
        country: z.string(),
      }),
      images: z.array(z.string()).max(12),
      videos: z.array(z.string()).max(2),
      amenities: z.array(z.string()),
      bedrooms: z.number().optional(),
      bathrooms: z.number().optional(),
      sqft: z.number().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const property = db.createProperty({
      id: generateId(),
      userId: ctx.userId,
      type: input.type,
      title: input.title,
      description: input.description,
      price: input.price,
      currency: input.currency,
      category: input.category,
      location: input.location,
      images: input.images,
      videos: input.videos,
      amenities: input.amenities,
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      sqft: input.sqft,
      available: true,
      featured: false,
      boosted: false,
      views: 0,
      saves: 0,
      leads: 0,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      success: true,
      property,
    };
  });

function generateId(): string {
  return `prop-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}
