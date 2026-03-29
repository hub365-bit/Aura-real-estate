import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";

export const listNotificationsProcedure = protectedProcedure
  .input(
    z.object({
      unreadOnly: z.boolean().default(false),
    })
  )
  .query(async ({ ctx, input }) => {
    const notifications = db.getNotifications(ctx.userId, input.unreadOnly);

    const unreadCount = db.getNotifications(ctx.userId, true).length;

    return {
      notifications,
      unreadCount,
      total: notifications.length,
    };
  });
