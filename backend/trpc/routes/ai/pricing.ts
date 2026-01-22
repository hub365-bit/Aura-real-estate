import { z } from "zod";
import { publicProcedure } from "../../create-context";

export const getAIPricingProcedure = publicProcedure
  .input(
    z.object({
      propertyId: z.string(),
      location: z.object({
        city: z.string(),
        area: z.string(),
      }),
      propertyType: z.string(),
      bedrooms: z.number().optional(),
      sqft: z.number().optional(),
    })
  )
  .query(
    async ({
      input,
    }): Promise<{
      suggestedPrice: number;
      priceRange: { min: number; max: number };
      competitiveness: "good_deal" | "fair" | "overpriced";
      marketAverage: number;
      confidence: number;
    }> => {
      console.log("🧠 Calculating AI pricing for property:", input.propertyId);

      const basePrice = 20000;
      const locationMultiplier = input.location.area.toLowerCase().includes("kilimani") ? 1.5 : 1.0;
      const bedroomMultiplier = (input.bedrooms || 1) * 1.2;

      const suggestedPrice = Math.round(basePrice * locationMultiplier * bedroomMultiplier);
      const marketAverage = suggestedPrice * 1.1;

      return {
        suggestedPrice,
        priceRange: {
          min: Math.round(suggestedPrice * 0.85),
          max: Math.round(suggestedPrice * 1.15),
        },
        competitiveness: "fair",
        marketAverage,
        confidence: 85,
      };
    }
  );
