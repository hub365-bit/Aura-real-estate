import { z } from "zod";
import { publicProcedure } from "../../create-context";

export const calculateQualityScoreProcedure = publicProcedure
  .input(z.object({ propertyId: z.string() }))
  .mutation(
    async ({
      input,
    }): Promise<{
      score: number;
      breakdown: {
        photoQuality: number;
        descriptionCompleteness: number;
        responseSpeed: number;
        reviews: number;
      };
      improvements: string[];
    }> => {
      console.log("📸 Calculating quality score for property:", input.propertyId);

      const photoQuality = 25;
      const descriptionCompleteness = 20;
      const responseSpeed = 15;
      const reviews = 20;

      const totalScore = photoQuality + descriptionCompleteness + responseSpeed + reviews;

      const improvements: string[] = [];
      if (photoQuality < 25) improvements.push("Add more high-quality photos");
      if (descriptionCompleteness < 20) improvements.push("Complete property description");
      if (responseSpeed < 15) improvements.push("Improve response time to inquiries");

      return {
        score: totalScore,
        breakdown: {
          photoQuality,
          descriptionCompleteness,
          responseSpeed,
          reviews,
        },
        improvements,
      };
    }
  );
