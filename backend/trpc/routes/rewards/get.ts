import { protectedProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";

export const getRewardsProcedure = protectedProcedure.query(async ({ ctx }) => {
  const user = db.getUser(ctx.userId);
  
  if (!user) {
    throw new Error("User not found");
  }

  const history = [
    { id: "1", action: "Property Review", points: 50, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: "2", action: "Booking Completed", points: 30, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    { id: "3", action: "Business Follow", points: 10, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    { id: "4", action: "Property Comment", points: 20, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
  ];

  const leaderboard = db.getUsers()
    .sort((a, b) => b.rewardPoints - a.rewardPoints)
    .slice(0, 10)
    .map((u, index) => ({
      rank: index + 1,
      userId: u.id,
      name: u.name,
      avatar: u.avatar,
      points: u.rewardPoints,
    }));

  const userRank = leaderboard.findIndex(l => l.userId === ctx.userId) + 1;

  return {
    points: user.rewardPoints,
    history,
    leaderboard,
    userRank: userRank || null,
  };
});
