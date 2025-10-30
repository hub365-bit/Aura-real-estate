import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";

export const createPostProcedure = protectedProcedure
  .input(
    z.object({
      businessId: z.string().optional(),
      type: z.enum(["post", "reel"]).default("post"),
      content: z.string().min(1),
      media: z.array(z.string()).default([]),
      hashtags: z.array(z.string()).default([]),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const post = db.createPost({
      id: generateId(),
      userId: ctx.userId,
      businessId: input.businessId,
      type: input.type,
      content: input.content,
      media: input.media,
      hashtags: input.hashtags,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      success: true,
      post,
    };
  });

function generateId(): string {
  return `post-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}
