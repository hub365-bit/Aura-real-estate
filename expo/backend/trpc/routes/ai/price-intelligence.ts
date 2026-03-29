import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const getPriceIntelligenceProcedure = publicProcedure
  .input(z.object({
    propertyType: z.string(),
    location: z.object({
      city: z.string(),
      lat: z.number(),
      lng: z.number(),
    }),
    bedrooms: z.number().optional(),
    area: z.number().optional(),
  }))
  .query(async ({ input, ctx }) => {
    const { propertyType, location, bedrooms, area } = input;

    console.log(`[AI Price] Analyzing price for ${propertyType} in ${location.city}`);

    const basePrice = bedrooms ? bedrooms * 15000 : 50000;
    const marketAverage = basePrice * 1.1;
    const suggestedPrice = basePrice * 0.95;

    return {
      suggestedPrice,
      marketAverage,
      competitiveness: 'competitive' as const,
      priceLabel: 'fair-price' as const,
      bestPostingTime: 'Monday 9:00 AM',
      demandLevel: 'high' as const,
    };
  });
