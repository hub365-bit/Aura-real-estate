import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const trustDeviceProcedure = publicProcedure
  .input(z.object({
    userId: z.string(),
    deviceId: z.string(),
    otp: z.string(),
  }))
  .mutation(async ({ input, ctx }) => {
    const { userId, deviceId, otp } = input;

    console.log(`[Devices] Trusting device: ${deviceId}`, { userId, otp });

    return {
      success: true,
      message: 'Device trusted successfully',
    };
  });
