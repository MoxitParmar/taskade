import { v } from "convex/values";
import { mutation } from "../_generated/server";

import { logActivity, createCommentMetadata } from "../lib/activityLogs";

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
      userId,
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
        const { userId, orgId } = args;
        const now = Date.now();

        // fetch comment
        const comment = await ctx.db.get("taskComments", args.commentId);

        if(!comment){
            throw new Error("Comment not found");
        }

        if(comment.orgId !== orgId){
            throw new Error("Unauthorized");
        }

        if(comment.createdBy !== userId){
            throw new Error("Only the creator can update the comment");
        }

        // update comment
        await ctx.db.patch("taskComments", args.commentId, {
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
    },

    handler: async (ctx, args) => {
        const { userId, orgId } = args

        // fetch comment
        const comment = await ctx.db.get("taskComments", args.commentId);

        if(!comment){
            throw new Error("Comment not found");
        }

        if(comment.orgId !== orgId){
            throw new Error("Unauthorized");
        }

        if(comment.createdBy !== userId){
            throw new Error("Only the creator can delete the comment");
        }

        // delete comment
        await ctx.db.delete("taskComments", args.commentId);

        return args.commentId;
    },
});