import { Id } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";
// import { getActivityLogs } from "../activityLogs/queries";


export type ActivityType =
  | "task_created"
  | "task_updated"
  | "task_assigned"
  | "task_status_changed"
  | "comment_added";

export type EntityType = "task" | "comment";

export interface ActivityLogParams {
  type: ActivityType;
  entityType: EntityType;
  entityId: Id<"tasks"> | Id<"taskComments">;
  userId: Id<"users">;
  orgId: Id<"organizations">;
  taskId?: Id<"tasks">; // Optional, only for task-related activities
  // eslint-disable-next-line
  metadata?: Record<string, any>;
}

/**
 * Log an activity and maintain only the last 100 logs per user
 *
 * @param ctx - Mutation context
 * @param params - Activity log parameters
 * @returns The created activity log ID
 *
 * @example
 * await logActivity(ctx, {
 *   type: "task_created",
 *   entityType: "task",
 *   entityId: taskId,
 *   userId: user._id,
 *   orgId: orgId,
 *   metadata: { taskName: "New Task" }
 * });
 */
export async function logActivity(
  ctx: MutationCtx,
  params: ActivityLogParams,
): Promise<Id<"activityLogs">> {
  const now = Date.now();

  // Create the activity log
  const activityLogId = await ctx.db.insert("activityLogs", {
    orgId: params.orgId,
    type: params.type,
    entityType: params.entityType,
      entityId: params.entityId,
      taskId: params.taskId,
      userId: params.userId,
    metadata: JSON.stringify(params.metadata || {}),
    createdAt: now,
    updatedAt: now,
  });

  // Get all activity logs for this user, ordered by creation date (newest first)
  // const userLogs = await getActivityLogs(ctx, {
  //   orgId: params.orgId,
  //     userIdFilter: params.userId,
  //     limit: 500, 
  // });

  // // If there are more than 100 logs, delete the oldest ones
  // if (userLogs.length > 500) {
  //   const logsToDelete = userLogs.slice(500); // Get everything after the first 100

  //   for (const log of logsToDelete) {
  //     await ctx.db.delete(log._id);
  //   }
  // }

  return activityLogId;
}

/**
 * Helper function to create task-related activity metadata
 */
export function createTaskMetadata(taskData: {
  name?: string;
  status?: string;
  priority?: string;
  assigneeName?: string;
  // eslint-disable-next-line
  changes?: Record<string, { from: any; to: any }>;
}) {
  return taskData;
}

/**
 * Helper function to create comment-related activity metadata
 */
export function createCommentMetadata(commentData: {
  content?: string;
  taskName?: string;
}) {
  return commentData;
}

export async function deleteActivityLogs(
  ctx: MutationCtx,
  params: {
    orgId: Id<"organizations">;
  },
  taskId: Id<"tasks"> 
) {
  const logs = await ctx.db
    .query("activityLogs")
    .withIndex("by_org_task", (q) => q.eq("orgId", params.orgId).eq("taskId", taskId))
    .first();


  if (logs) {
    await ctx.db.delete(logs._id);
  }
}
