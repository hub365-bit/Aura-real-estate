import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const getNeighborhoodInfoProcedure = publicProcedure
  .input(z.object({
    lat: z.number(),
    lng: z.number(),
  }))
  .query(async ({ input, ctx }) => {
    const { lat, lng } = input;

    console.log(`[Neighborhood] Getting info for location: ${lat}, ${lng}`);

    return {
      schools: [
        { name: 'Nairobi Primary School', distance: 1.2, rating: 4.5 },
        { name: 'Westlands Academy', distance: 2.5, rating: 4.8 },
      ],
      hospitals: [
        { name: 'Nairobi Hospital', distance: 3.0, type: 'General' },
        { name: 'Aga Khan Hospital', distance: 4.5, type: 'Specialist' },
      ],
      transport: [
        { type: 'Matatu Stop', name: 'Westlands Stage', distance: 0.5 },
        { type: 'Bus Stop', name: 'City Hoppa', distance: 0.8 },
      ],
      safetyRating: 8.5,
      noiseLevel: 'medium' as const,
      activityLevel: 'busy' as const,
    };
  });
