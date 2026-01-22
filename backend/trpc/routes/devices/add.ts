import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { TrustedDevice } from "../../../db/schema";

export const addDeviceProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      deviceId: z.string(),
      deviceName: z.string(),
      otpCode: z.string(),
    })
  )
  .mutation(async ({ input }): Promise<TrustedDevice> => {
    console.log("📱 Adding new device for user:", input.userId);

    if (input.otpCode !== "123456") {
      throw new Error("Invalid OTP code");
    }

    const device: TrustedDevice = {
      id: `device_${Date.now()}`,
      deviceId: input.deviceId,
      deviceName: input.deviceName,
      lastUsed: new Date(),
      trusted: true,
      addedAt: new Date(),
    };

    console.log("✅ Device added successfully");
    return device;
  });
