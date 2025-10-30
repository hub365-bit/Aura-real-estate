import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";

export const addRewardPointsProcedure = protectedProcedure
  .input(
    z.object({
      action: z.enum(["comment", "rating", "booking", "follow", "review"]),
      points: z.number().positive(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const user = db.getUser(ctx.userId);
    
    if (!user) {
      throw new Error("User not found");
    }

    const newPoints = user.rewardPoints + input.points;
    db.updateUser(ctx.userId, { rewardPoints: newPoints });

    db.createNotification({
      id: generateId(),
      userId: ctx.userId,
      type: "reward",
      title: "Reward Points Earned!",
      message: `You earned ${input.points} points for ${input.action}`,
      read: false,
      createdAt: new Date(),
    });

    return {
      success: true,
      points: newPoints,
      earned: input.points,
    };
  });

function generateId(): string {
  return `notif-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}
