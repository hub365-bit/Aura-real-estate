import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { TrustedDevice } from "../../../db/schema";

export const listDevicesProcedure = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }): Promise<TrustedDevice[]> => {
    console.log("📱 Fetching devices for user:", input.userId);

    const mockDevices: TrustedDevice[] = [
      {
        id: "device_1",
        deviceId: "abc123xyz",
        deviceName: "iPhone 14 Pro",
        lastUsed: new Date(),
        trusted: true,
        addedAt: new Date(Date.now() - 86400000 * 60),
      },
      {
        id: "device_2",
        deviceId: "def456uvw",
        deviceName: "Samsung Galaxy S23",
        lastUsed: new Date(Date.now() - 86400000 * 3),
        trusted: true,
        addedAt: new Date(Date.now() - 86400000 * 30),
      },
    ];

    return mockDevices;
  });
