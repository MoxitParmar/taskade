import { query } from "../_generated/server";
import { v } from "convex/values";

export const getTaskComments = query({
  args: {
    taskId: v.id("tasks"),
    cursor: v.optional(v.string()),
    limit: v.number(),
    orgId: v.id("organizations"),
  },

  handler: async (ctx, args) => {
        const { orgId } = args;

    const task = await ctx.db.get(args.taskId);

    if (!task || task.orgId !== orgId) {
      throw new Error("Task not found");
    }

    const commentsQuery = ctx.db
      .query("taskComments")
      .withIndex("by_org_task", (q) =>
        q.eq("orgId", orgId).eq("taskId", args.taskId),
      )
      .order("desc");

    const paginatedComments = await commentsQuery.paginate({
      numItems: args.limit,
      cursor: args.cursor ?? null,
    });

    const formattedComments = await Promise.all(
      paginatedComments.page.map(async (comment) => {
        const author = await ctx.db.get(comment.createdBy);
        const authorName = author ? author.name : "Unknown";
        const authorAvatar = author ? author.imageUrl : "";

        return {
          id: comment._id,
          content: comment.content,
          createdAt: comment.createdAt,
          authorName: authorName,
          authorAvatar: authorAvatar,
        };
      }),
    );

    return {
      ...paginatedComments,
      page: formattedComments,
    };
  },
});
