import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const listDevicesProcedure = publicProcedure
  .input(z.object({
    userId: z.string(),
  }))
  .query(async ({ input, ctx }) => {
    const { userId } = input;

    console.log(`[Devices] Listing for user: ${userId}`);

    return {
      devices: [
        {
          id: 'device_1',
          name: 'iPhone 14 Pro',
          platform: 'iOS',
          lastUsed: new Date().toISOString(),
          trusted: true,
        },
      ],
    };
  });
