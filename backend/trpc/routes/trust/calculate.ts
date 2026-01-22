import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { TrustScore } from "../../../db/schema";

export const calculateTrustScoreProcedure = publicProcedure
  .input(z.object({ userId: z.string() }))
  .mutation(async ({ input }): Promise<TrustScore> => {
    console.log("🔐 Calculating trust score for user:", input.userId);

    const verifiedDocuments = 30;
    const completedBookings = 25;
    const responseTime = 20;
    const cancellationRate = -5;
    const reviewScore = 20;
    const disputeHistory = 0;

    const totalScore = 
      verifiedDocuments +
      completedBookings +
      responseTime +
      cancellationRate +
      reviewScore +
      disputeHistory;

    let level: "verified" | "building" | "restricted";
    if (totalScore >= 80) level = "verified";
    else if (totalScore >= 40) level = "building";
    else level = "restricted";

    const trustScore: TrustScore = {
      userId: input.userId,
      score: totalScore,
      level,
      factors: {
        verifiedDocuments,
        completedBookings,
        responseTime,
        cancellationRate,
        reviewScore,
        disputeHistory,
      },
      lastCalculated: new Date(),
    };

    console.log("✅ Trust score calculated:", trustScore);
    return trustScore;
  });
