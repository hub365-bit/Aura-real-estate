import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const signAgreementProcedure = publicProcedure
  .input(z.object({
    agreementId: z.string(),
    userId: z.string(),
    signature: z.string(),
  }))
  .mutation(async ({ input, ctx }) => {
    const { agreementId, userId, signature } = input;

    console.log(`[Agreement] Signed by user: ${userId}`, { agreementId });

    return {
      success: true,
      signedAt: new Date().toISOString(),
      message: 'Agreement signed successfully',
    };
  });
