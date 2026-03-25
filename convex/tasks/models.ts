// convex/tasks/model.ts

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";
import { formatUser, getUserSafe } from "../users/models";
import { formatProject, getProjectOrThrow } from "../projects/models";

type Ctx = QueryCtx | MutationCtx;
export type Task = Doc<"tasks">;


export async function getTaskOrThrow(
  ctx: Ctx,
  taskId: Id<"tasks">,
  orgId: Id<"organizations">
) {
  const task = await ctx.db.get(taskId);

  if (!task || task.orgId !== orgId) {
    throw new Error("Task not found");
  }

  return task;
}


export async function formatTask(ctx: Ctx, task: Task) {
  const [assignee, project] = await Promise.all([
    getUserSafe(ctx, task.assignee),
    getProjectOrThrow(ctx, task.projectId, task.orgId),
  ]);
  
  return {
    id: task._id,
    createdAt: task._creationTime,
    name: task.name,
    description: task.description,
    status: task.status,
    priority: task.priority,
    isOverdue: task.dueDate ? Date.now() > task.dueDate : false,
    dueDate: task.dueDate,
    project: await formatProject(ctx, project),
    assignee: formatUser(assignee),
  };
}


export async function buildTasksQuery(
  ctx: QueryCtx,
  args: {
    orgId: Id<"organizations">;
    userId?: Id<"users">;
    projectId?: Id<"projects">;
    assigneeId?: Id<"users">;
  }
) {
  const { orgId, userId, projectId, assigneeId } = args;

  if (projectId) {
    await getProjectOrThrow(ctx, projectId, orgId);

    return ctx.db
      .query("tasks")
      .withIndex("by_org_project", (q) =>
        q.eq("orgId", orgId).eq("projectId", projectId)
      )
      .order("desc");
  }
    
    if ( userId) {
        return ctx.db
            .query("tasks")
            .withIndex("by_org_assignee", (q) =>
                q.eq("orgId", orgId).eq("assignee", userId)
            )
            .order("desc");
    } else if (assigneeId) {
        return ctx.db
            .query("tasks")
            .withIndex("by_org_assignee", (q) =>
                q.eq("orgId", orgId).eq("assignee", assigneeId)
            )
            .order("desc");
    }
    
    return ctx.db
        .query("tasks")
        .withIndex("by_org", (q) => q.eq("orgId", orgId))
        .order("desc");
}
