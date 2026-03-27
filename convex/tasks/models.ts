// convex/tasks/model.ts

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";
import { formatUser, getUserSafe } from "../users/models";
import { formatProject, getProjectOrThrow } from "../projects/models";

type Ctx = QueryCtx | MutationCtx;

export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "todo" | "in-progress" | "done";
type TaskI = Doc<"tasks">;
export interface Task {
  _id: Id<"tasks">;
  createdAt: number;
  name: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  isOverdue: boolean;
  dueDate?: number;
  project: Awaited<ReturnType<typeof formatProject>>;
  assignee: ReturnType<typeof formatUser>;
}

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


export async function formatTask(ctx: Ctx, task: TaskI) {
      
  const [assignee, project] = await Promise.all([
    getUserSafe(ctx, task.assignee),
    getProjectOrThrow(ctx, task.projectId, task.orgId),
  ]);
  
  return {
    _id: task._id,
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
      status?: TaskStatus;
      priority?: TaskPriority;
  }
) {
  const { orgId, userId, projectId, assigneeId, status, priority } = args;
  if (projectId) {
    await getProjectOrThrow(ctx, projectId, orgId);

    let q =ctx.db
      .query("tasks")
      .withIndex("by_org_project", (q) =>
        q.eq("orgId", orgId).eq("projectId", projectId)
      )
      .order("desc");

      if (status) q = q.filter((q) => q.eq(q.field("status"), status));
  if (priority) q = q.filter((q) => q.eq(q.field("priority"), priority));
  if (assigneeId) q = q.filter((q) => q.eq(q.field("assignee"), assigneeId));

  return q;
  }

    if ( userId) {
        return ctx.db
            .query("tasks")
            .withIndex("by_org_assignee", (q) =>
                q.eq("orgId", orgId).eq("assignee", userId)
            )
            .order("desc");
          }
    
    return ctx.db
        .query("tasks")
        .withIndex("by_org", (q) => q.eq("orgId", orgId))
        .order("desc");
}
