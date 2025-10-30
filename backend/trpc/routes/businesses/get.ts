import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";
import { TRPCError } from "@trpc/server";

export const getBusinessProcedure = publicProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input }) => {
    const business = db.getBusiness(input.id);
    
    if (!business) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }

    return business;
  });
