import { Doc, Id } from "../_generated/dataModel";
import { getUserSafe } from "../users/models";
import { QueryCtx, MutationCtx } from "../_generated/server";

type Ctx = QueryCtx | MutationCtx;
type CommentI = Doc<"taskComments">;
  export interface Comment {
    _id: Id<"taskComments">;
    content: string;
    createdAt: number;
    authorName: string;
    authorAvatar: string;
  }
  
export async function formatComments(ctx: Ctx, comment: CommentI) {
    const author = await getUserSafe(ctx, comment.createdBy);
    const authorName = author ? author.name : "Unknown";
    const authorAvatar = author ? author.imageUrl : "";

    return {
      _id: comment._id,
      content: comment.content,
      createdAt: comment.createdAt,
      authorName: authorName,
      authorAvatar: authorAvatar,
    };
  }


export async function getTaskCommentsQuery(
  ctx: QueryCtx,
  args: {
      taskId: Id<"tasks">;
      orgId: Id<"organizations">;
  }
) {
  const { orgId, taskId } = args;
    if (!taskId || !orgId) {
        throw new Error("Task ID and Org ID are required");
    }
    return ctx.db
      .query("taskComments")
      .withIndex("by_org_task", (q) =>
        q.eq("orgId", orgId).eq("taskId", taskId),
      )
      .order("desc");
}

export async function getCommentOrThrow(
  ctx: Ctx,
  commentId: Id<"taskComments">,
  orgId: Id<"organizations">
) {
  const comment = await ctx.db.get(commentId);

  if (!comment || comment.orgId !== orgId) {    throw new Error("Comment not found");;
  }
  return comment;;
}


