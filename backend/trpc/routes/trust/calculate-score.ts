import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const calculateTrustScoreProcedure = publicProcedure
  .input(z.object({
    userId: z.string(),
  }))
  .query(async ({ input, ctx }) => {
    const { userId } = input;

    const verifiedId = true;
    const verifiedBusiness = true;
    const completedBookings = 25;
    const avgResponseTime = 15;
    const cancellationRate = 0.05;
    const disputeCount = 0;

    let score = 0;

    if (verifiedId) score += 25;
    if (verifiedBusiness) score += 20;
    
    if (completedBookings >= 50) score += 30;
    else if (completedBookings >= 20) score += 20;
    else if (completedBookings >= 5) score += 10;
    
    if (avgResponseTime <= 10) score += 15;
    else if (avgResponseTime <= 30) score += 10;
    else if (avgResponseTime <= 60) score += 5;
    
    if (cancellationRate <= 0.05) score += 10;
    else if (cancellationRate <= 0.15) score += 5;
    
    if (disputeCount === 0) score += 10;
    else if (disputeCount <= 2) score += 5;

    let level: 'verified' | 'building' | 'restricted' = 'building';
    if (score >= 75) level = 'verified';
    else if (score < 40) level = 'restricted';

    return {
      score,
      level,
      verifiedId,
      verifiedBusiness,
      completedBookings,
      avgResponseTime,
      cancellationRate,
      disputeCount,
      lastUpdated: new Date().toISOString(),
    };
  });
