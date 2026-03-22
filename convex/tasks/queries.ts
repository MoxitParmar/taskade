import { Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import { paginateOrTake } from "../lib/paginateOrTake";
import { buildTasksQuery, formatTask, getTaskOrThrow } from "./models";

export async function getTasks(
    ctx: QueryCtx,
    args: {
        cursor?: string;
        limit?: number;
        orgId: Id<"organizations">;
        userId?: Id<"users">;
        projectId?: Id<"projects">;
        assigneeId?: Id<"users">;
        paginate?: boolean;
    }
) {
    const query = await buildTasksQuery(ctx, args);

    return await paginateOrTake({
      query,
      ctx,
      limit: args.limit,
      cursor: args.cursor,
      paginate: args.paginate,
      map: (task) => formatTask(ctx, task),
    });

}

/* -------------------------------------------------- */
/* 🔍 Single Task */
/* -------------------------------------------------- */

export async function getTaskById(
  ctx: QueryCtx,
    taskId: Id<"tasks">,
  orgId: Id<"organizations">
) {
  const task = await getTaskOrThrow(ctx, taskId, orgId);
  return await formatTask(ctx, task);
}