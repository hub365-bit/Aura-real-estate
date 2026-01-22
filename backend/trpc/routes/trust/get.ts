import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { TrustScore } from "../../../db/schema";

export const getTrustScoreProcedure = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }): Promise<TrustScore> => {
    console.log("🔐 Fetching trust score for user:", input.userId);

    const mockTrustScore: TrustScore = {
      userId: input.userId,
      score: 85,
      level: "verified",
      factors: {
        verifiedDocuments: 30,
        completedBookings: 25,
        responseTime: 20,
        cancellationRate: -5,
        reviewScore: 20,
        disputeHistory: -5,
      },
      lastCalculated: new Date(),
    };

    return mockTrustScore;
  });
