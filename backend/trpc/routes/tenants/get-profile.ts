import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { TenantProfile } from "../../../db/schema";

export const getTenantProfileProcedure = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }): Promise<TenantProfile> => {
    console.log("🧍 Fetching tenant profile for user:", input.userId);

    const profile: TenantProfile = {
      userId: input.userId,
      pastStays: 3,
      avgRating: 4.5,
      paymentReliability: 95,
      reviewCount: 8,
      cancellationRate: 5,
      lastStayDate: new Date(Date.now() - 86400000 * 30),
      issues: [
        {
          type: "late_payment",
          date: new Date(Date.now() - 86400000 * 180),
          resolved: true,
        },
      ],
    };

    return profile;
  });
