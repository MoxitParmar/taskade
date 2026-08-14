import { Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import { paginateOrTake } from "../lib/paginateOrTake";
import {  formatActivityLog, getActivityLogsForUser } from "./models";

export async function getActivityLogs(
  ctx: QueryCtx,
  args: {
    cursor?: string;
    limit?: number;
    orgId: Id<"organizations">;
    userId: Id<"users">;
    entityType?: string;
    assignee?: Id<"users">;
    paginate?: boolean;
  }
) {
  // console.log("getActivityLogs called with args:", args); // Debugging line

  const query = getActivityLogsForUser(ctx, args);

  return paginateOrTake({
    query,
    ctx,
    limit: args.limit,
    cursor: args.cursor,
    paginate: args.paginate,
    map: (log) => formatActivityLog(ctx, log),
  });
}