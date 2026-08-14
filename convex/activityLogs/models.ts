// convex/activityLogs/model.ts

import { OrderedQuery } from "convex/server";
import { QueryCtx, MutationCtx } from "../_generated/server";
import { DataModel, Doc, Id } from "../_generated/dataModel";
import { formatUser, getUserSafe } from "../users/models";

type Ctx = QueryCtx | MutationCtx;
type ActivityLogsI = Doc<"activityLogs">;
export type ActivityType = "task" | "comment" ;
export type ActivityStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type Type = "task_created" | "task_updated" | "task_assigned" | "task_status_changed" | "comment_added"
export interface ActivityLogs {
  _id: Id<"activityLogs">;
  _creationTime: number;
  orgId: Id<"organizations">;
  status?: ActivityStatus;
  assigneeId?: Id<"users">;
  createdById: Id<"users">;
  entityId: string;
  entityType: ActivityType;
  type: string;
  metadata: Record<string, any> | null;
  user: ReturnType<typeof formatUser>;
  entityDetails: Doc<any> | null;
  createdAt?: number;
  updatedAt?: number;
}

export async function getEntitySafe(
    ctx: Ctx,
  entityId: Id<"tasks"> | Id<"taskComments"> 
) {
  if (!entityId) return null;

  // you can later split this per entity type if needed
  return await ctx.db.get(entityId);
}


export function parseMetadata(metadata: string | undefined) {
  try {
    return metadata ? JSON.parse(metadata) : null;
  } catch {
    return null;
  }
}


export function getActivityLogsForUser(
  ctx: QueryCtx,
  args: {
    orgId: Id<"organizations">;
    userId: Id<"users">;
    entityType?: string;
    assignee?: Id<"users">;
  }
): OrderedQuery<DataModel["activityLogs"]> {
  const { orgId, userId, entityType, assignee } = args;

  let query = ctx.db
    .query("activityLogs")
    .withIndex("by_org", (q) => q.eq("orgId", orgId))
    .filter((q) =>
      q.or(
        q.eq(q.field("assigneeId"), userId),
        q.eq(q.field("createdById"), userId)
      )
    );

  if (entityType) {
    query = query.filter((q) =>
      q.eq(q.field("entityType"), entityType as ActivityType)
    );
  }

  if (assignee) {
    query = query.filter((q) => q.or(q.eq(q.field("assigneeId"), assignee), q.eq(q.field("createdById"), assignee)));
  }

  return query.order("desc");
}

/* -------------------------------------------------- */
/* 📦 Formatting */
/* -------------------------------------------------- */

export async function formatActivityLog(ctx: Ctx, log: ActivityLogsI) {
  const [user, entityDetails] = await Promise.all([
    getUserSafe(ctx, log.createdById || log.assigneeId),
    getEntitySafe(ctx,  log.entityId),
  ]);

  return {
    ...log,
    user: formatUser(user),
    entityDetails,
    metadata: parseMetadata(log.metadata),
  };
}

