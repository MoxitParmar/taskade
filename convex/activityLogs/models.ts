// convex/activityLogs/model.ts

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";
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

/* -------------------------------------------------- */
/* 🧠 Query Builder */
/* -------------------------------------------------- */

export function buildActivityLogsQuery(
  ctx: QueryCtx,
  args: {
    orgId: Id<"organizations">;
    entityType?: string;
    type?: string;
    userIdFilter?: Id<"users">;
  }
) {
  const { orgId, entityType, type, userIdFilter } = args;

  if (entityType) {
    return ctx.db
      .query("activityLogs")
        .withIndex("by_org_entity", (q) =>
        q.eq("orgId", orgId).eq("entityType", entityType as ActivityType)
      )
      .order("desc");
  }

  if (type) {
    return ctx.db
      .query("activityLogs")
        .withIndex("by_org_type", (q) =>
        q.eq("orgId", orgId).eq("type", type as Type)
      )
      .order("desc");
  }

  if (userIdFilter) {
    return ctx.db
      .query("activityLogs")
      .withIndex("by_org_created", (q) =>
        q.eq("orgId", orgId).eq("createdById", userIdFilter)
      )
      .order("desc");
  }

  return ctx.db
    .query("activityLogs")
    .withIndex("by_org", (q) => q.eq("orgId", orgId))
    .order("desc");
}

/* -------------------------------------------------- */
/* 🎯 "Involving me" feed (actor ∪ assignee ∪ creator) */
/* -------------------------------------------------- */

/**
 * Returns the most recent activity logs that involve the given user:
 *  - things the user did (actor),
 *  - tasks assigned to the user by someone else,
 *  - comments on tasks the user created or is assigned to.
 *
 * Convex can't OR across indexes in a single query, so we run one query per
 * relevance branch, then merge, dedupe by `_id`, and re-sort by recency.
 */
export async function getActivityLogsForUser(
  ctx: QueryCtx,
  args: {
    orgId: Id<"organizations">;
    userId: Id<"users">;
    limit?: number;
  }
): Promise<ActivityLogsI[]> {
  const { orgId, userId, limit = 50 } = args;
  // Per-branch cap: enough to produce a correct global top-N after merging.
  const cap = Math.min(Math.max(limit * 2, 100), 1000);

  const [asAssignee, asCreator] = await Promise.all([
    ctx.db
      .query("activityLogs")
      .withIndex("by_org_assignee", (q) =>
        q.eq("orgId", orgId).eq("assigneeId", userId)
      )
      .order("desc")
      .take(cap),
    ctx.db
      .query("activityLogs")
      .withIndex("by_org_created", (q) =>
        q.eq("orgId", orgId).eq("createdById", userId)
      )
      .order("desc")
      .take(cap),
  ]);

  const seen = new Set<Id<"activityLogs">>();
  const merged: ActivityLogsI[] = [];

  for (const log of [...asAssignee, ...asCreator]) {
    if (seen.has(log._id)) continue;
    seen.add(log._id);
    merged.push(log);
  }

  merged.sort((a, b) => b.createdAt - a.createdAt);

  return merged.slice(0, limit);
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

