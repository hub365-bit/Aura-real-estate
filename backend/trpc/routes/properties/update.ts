import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";
import { TRPCError } from "@trpc/server";
import { propertyTypeSchema } from "../../../db/schema";

export const updatePropertyProcedure = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      type: propertyTypeSchema.optional(),
      title: z.string().min(5).optional(),
      description: z.string().min(20).optional(),
      price: z.number().positive().optional(),
      available: z.boolean().optional(),
      amenities: z.array(z.string()).optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const property = db.getProperty(input.id);
    
    if (!property) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Property not found",
      });
    }

    if (property.userId !== ctx.userId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You don't have permission to update this property",
      });
    }

    const { id, ...updates } = input;
    const updatedProperty = db.updateProperty(id, updates);

    return {
      success: true,
      property: updatedProperty,
    };
  });
