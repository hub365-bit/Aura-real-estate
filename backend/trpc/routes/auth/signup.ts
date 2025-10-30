import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";
import { TRPCError } from "@trpc/server";
import { userRoleSchema } from "../../../db/schema";

export const signupProcedure = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      phone: z.string(),
      password: z.string().min(6),
      name: z.string().min(2),
      role: userRoleSchema.default("user"),
    })
  )
  .mutation(async ({ input }) => {
    const existingUser = db.getUserByEmail(input.email);
    
    if (existingUser) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "User with this email already exists",
      });
    }

    const user = db.createUser({
      id: generateId(),
      email: input.email,
      phone: input.phone,
      name: input.name,
      role: input.role,
      verified: false,
      documentsVerified: false,
      twoFactorEnabled: false,
      rewardPoints: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    return {
      success: true,
      userId: user.id,
      message: "Account created. Please verify your phone number.",
      otpCode,
    };
  });

function generateId(): string {
  return `user-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}
