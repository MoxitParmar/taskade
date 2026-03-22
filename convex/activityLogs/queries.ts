import { Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import { paginateOrTake } from "../lib/paginateOrTake";
import { buildActivityLogsQuery, formatActivityLog } from "./models";

export async function getActivityLogs(
  ctx: QueryCtx,
  args: {
    cursor?: string;
    limit: number;
    orgId: Id<"organizations">;
    entityType?: string;
    type?: string;
      userIdFilter?: Id<"users">;
        paginate?: boolean;
  }
) {
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