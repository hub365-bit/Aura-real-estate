import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";

export const listPostsProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string().optional(),
      businessId: z.string().optional(),
      type: z.enum(["post", "reel"]).optional(),
      limit: z.number().default(20),
      offset: z.number().default(0),
    })
  )
  .query(async ({ input }) => {
    const posts = db.getPosts({
      userId: input.userId,
      businessId: input.businessId,
      type: input.type,
    });

    const paginatedPosts = posts.slice(input.offset, input.offset + input.limit);

    return {
      posts: paginatedPosts,
      total: posts.length,
      hasMore: input.offset + input.limit < posts.length,
    };
  });
