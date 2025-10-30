import { protectedProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";

export const listMessagesProcedure = protectedProcedure.query(async ({ ctx }) => {
  const messages = db.getMessages(ctx.userId);

  return {
    messages,
    total: messages.length,
  };
});
