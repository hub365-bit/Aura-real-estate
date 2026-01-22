import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { NeighborhoodData } from "../../../db/schema";

export const getNeighborhoodDataProcedure = publicProcedure
  .input(
    z.object({
      lat: z.number(),
      lng: z.number(),
    })
  )
  .query(async ({ input }): Promise<NeighborhoodData> => {
    console.log("🏘️ Fetching neighborhood data for location:", input);

    const neighborhoodData: NeighborhoodData = {
      schools: [
        { name: "Brookhouse School", distance: 1.2, rating: 4.5 },
        { name: "Strathmore School", distance: 2.3, rating: 4.7 },
        { name: "Riara Springs Academy", distance: 0.8, rating: 4.3 },
      ],
      hospitals: [
        { name: "Nairobi Hospital", distance: 3.5, type: "General" },
        { name: "Aga Khan Hospital", distance: 4.2, type: "General" },
        { name: "Mediheal Group", distance: 1.8, type: "Clinic" },
      ],
      transport: [
        { type: "Matatu Stage", name: "Kilimani Stage", distance: 0.5 },
        { type: "Bus Stop", name: "Yaya Centre", distance: 1.0 },
        { type: "Uber Pickup", name: "Main Road", distance: 0.3 },
      ],
      safetyRating: 8.5,
      noiseLevel: "moderate",
    };

    return neighborhoodData;
  });
