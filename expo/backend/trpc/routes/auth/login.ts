import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";
import { TRPCError } from "@trpc/server";

export const loginProcedure = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })
  )
  .mutation(async ({ input }) => {
    const user = db.getUserByEmail(input.email);
    
    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }

    const token = await generateToken(user.id, user.role);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        verified: user.verified,
        rewardPoints: user.rewardPoints,
      },
      token,
    };
  });

async function generateToken(userId: string, role: string): Promise<string> {
  return `mock-token-${userId}-${role}`;
}
