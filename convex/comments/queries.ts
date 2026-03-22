
import { getTaskOrThrow } from "../tasks/models";
import { formatComments, getTaskCommentsQuery } from "./models";
import { Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import { paginateOrTake } from "../lib/paginateOrTake";

export async function getTaskComments(
  ctx: QueryCtx,
  args: {
    cursor?: string;
    limit?: number;
    orgId: Id<"organizations">;
      taskId: Id<"tasks">;
        paginate?: boolean;
  }
) {

      const { orgId } = args;

    await getTaskOrThrow(ctx, args.taskId, orgId);

    const query = await getTaskCommentsQuery(ctx, {taskId: args.taskId, orgId});

    return paginateOrTake({
      query,
      ctx,
      limit: args.limit,
      cursor: args.cursor,
      paginate: args.paginate,
      map: (log) => formatComments(ctx, log),
    });
}

