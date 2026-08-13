import { Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import { paginateOrTake } from "../lib/paginateOrTake";
import { buildActivityLogsQuery, formatActivityLog, getActivityLogsForUser } from "./models";

export async function getActivityLogs(
  ctx: QueryCtx,
  args: {
    cursor?: string;
    limit?: number;
    orgId: Id<"organizations">;
    entityType?: string;
    type?: string;
    userIdFilter?: Id<"users">;
    involvingUserId?: Id<"users">;
    paginate?: boolean;
  }
) {
  // "Involving me" feed: things I did + tasks assigned to me + comments on my
  // tasks (as assignee or creator). Non-paginated (callers use paginate: false).
  if (args.involvingUserId) {
    const logs = await getActivityLogsForUser(ctx, {
      orgId: args.orgId,
      userId: args.involvingUserId,
      limit: args.limit ?? 50,
    });

    const page = await Promise.all(logs.map((log) => formatActivityLog(ctx, log)));

    return {
      page,
      continueCursor: null,
      isDone: true,
    };
  }

  const query = buildActivityLogsQuery(ctx, args);

  return paginateOrTake({
    query,
    ctx,
    limit: args.limit,
    cursor: args.cursor,
    paginate: args.paginate,
    map: (log) => formatActivityLog(ctx, log),
  });
}