import { z } from "zod";
import { publicProcedure } from "../../create-context";

export const removeDeviceProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      deviceId: z.string(),
    })
  )
  .mutation(async ({ input }): Promise<{ success: boolean }> => {
    console.log("📱 Removing device:", input.deviceId);

    console.log("✅ Device removed successfully");
    return { success: true };
  });
