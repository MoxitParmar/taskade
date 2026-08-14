import { v } from "convex/values";
import { mutation } from "../_generated/server";

import { logActivity, createCommentMetadata, deleteActivityLogs } from "../lib/activityLogs";
import { getCommentOrThrow } from "./models";

// create comment
export const createComment = mutation({
  args: {
    content: v.string(),
        taskId: v.id("tasks"),
    userId: v.id("users"),
    orgId: v.id("organizations"),
  },

  handler: async (ctx, args) => {
    const { userId, orgId } = args;
    const now = Date.now();

    // create comment
    const commentId = await ctx.db.insert("taskComments", {
      orgId,
      taskId: args.taskId,

      content: args.content,
      createdBy: userId,
      
      createdAt: now,
      updatedAt: now,
    });
    
    // Log the activity
    await logActivity(ctx, {
      type: "comment_added",
      entityType: "comment",
      taskId: args.taskId,
      entityId: commentId,
      orgId,
      metadata: createCommentMetadata({
        content: args.content.substring(0, 100), // Store first 100 chars
        taskName: (await ctx.db.get(args.taskId))?.name,
      }),
    });

    return commentId;
  },
});

// update comment
export const updateComment = mutation({
    args: {
        commentId: v.id("taskComments"),
        content: v.string(),
        userId: v.id("users"),
        orgId: v.id("organizations"),
    },

    handler: async (ctx, args) => {
        const { userId, orgId, commentId } = args;
        const now = Date.now();

        // fetch comment
        const comment = await getCommentOrThrow(ctx, commentId, orgId);


        if(comment.createdBy !== userId){
            throw new Error("Only the creator can update the comment");
        }

        // update comment
        await ctx.db.patch("taskComments", commentId, {
            content: args.content,
            updatedAt: now,
        });

        return args.commentId;
    },
});

// delete comment
export const deleteComment = mutation({
    args: {
        commentId: v.id("taskComments"),
        userId: v.id("users"),
        orgId: v.id("organizations"),
        taskId: v.id("tasks"),
    },

    handler: async (ctx, args) => {
        const { userId, orgId, commentId } = args

        // fetch comment
        const comment = await getCommentOrThrow(ctx, commentId, orgId);

        if(comment.createdBy !== userId){
            throw new Error("Only the creator can delete the comment");
        }

        // delete comment
        await ctx.db.delete("taskComments", args.commentId);
        await deleteActivityLogs(ctx, { orgId }, args.commentId, "comment");

        return args.commentId;
    },
});