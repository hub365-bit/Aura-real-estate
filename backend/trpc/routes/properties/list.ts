import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";
import { propertyTypeSchema } from "../../../db/schema";

export const listPropertiesProcedure = publicProcedure
  .input(
    z.object({
      type: propertyTypeSchema.optional(),
      userId: z.string().optional(),
      available: z.boolean().optional(),
      limit: z.number().default(20),
      offset: z.number().default(0),
    })
  )
  .query(async ({ input }) => {
    const properties = db.getProperties({
      type: input.type,
      userId: input.userId,
      available: input.available,
    });

    const paginatedProperties = properties.slice(input.offset, input.offset + input.limit);

    return {
      properties: paginatedProperties,
      total: properties.length,
      hasMore: input.offset + input.limit < properties.length,
    };
  });
