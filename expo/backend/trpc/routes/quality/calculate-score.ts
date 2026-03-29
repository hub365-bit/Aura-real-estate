import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const calculateQualityScoreProcedure = publicProcedure
  .input(z.object({
    propertyId: z.string(),
  }))
  .query(async ({ input, ctx }) => {
    const { propertyId } = input;

    console.log(`[Quality Score] Calculating for property: ${propertyId}`);

    const photoQuality = 85;
    const descriptionCompleteness = 90;
    const responseSpeed = 75;
    const reviewScore = 88;

    const overall = (photoQuality + descriptionCompleteness + responseSpeed + reviewScore) / 4;

    const suggestions: string[] = [];
    if (photoQuality < 80) suggestions.push('Add more high-quality photos');
    if (descriptionCompleteness < 80) suggestions.push('Improve property description');
    if (responseSpeed < 70) suggestions.push('Respond faster to inquiries');

    return {
      overall,
      photoQuality,
      descriptionCompleteness,
      responseSpeed,
      reviewScore,
      suggestions,
    };
  });
