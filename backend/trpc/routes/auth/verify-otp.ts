import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";
import { TRPCError } from "@trpc/server";

export const verifyOtpProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      code: z.string().length(6),
    })
  )
  .mutation(async ({ input }) => {
    const user = db.getUser(input.userId);
    
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    db.updateUser(user.id, { verified: true });

    const token = await generateToken(user.id, user.role);

    return {
      success: true,
      message: "Phone number verified successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        verified: true,
      },
    };
  });

async function generateToken(userId: string, role: string): Promise<string> {
  return `mock-token-${userId}-${role}`;
}
