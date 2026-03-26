// convex/activityLogs/model.ts

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";
import { formatUser, getUserSafe } from "../users/models";

type Ctx = QueryCtx | MutationCtx;
type ActivityLogsI = Doc<"activityLogs">;
export type ActivityType = "task" | "comment" ;
export type ActivityStatus = "TODO" | "IN_PROGRESS" | "DONE";
export interface ActivityLogs {
  _id: Id<"activityLogs">;
  _creationTime: number;
  orgId: Id<"organizations">;
  status?: ActivityStatus;
  userId: Id<"users">;
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
    //eslint-disable-next-line
  entityId: any
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
          //eslint-disable-next-line
        q.eq("orgId", orgId).eq("entityType", entityType as any)
      )
      .order("desc");
  }

  if (type) {
    return ctx.db
      .query("activityLogs")
        .withIndex("by_org_type", (q) =>
          //eslint-disable-next-line
        q.eq("orgId", orgId).eq("type", type as any)
      )
      .order("desc");
  }

  if (userIdFilter) {
    return ctx.db
      .query("activityLogs")
      .withIndex("by_org_user", (q) =>
        q.eq("orgId", orgId).eq("userId", userIdFilter)
      )
      .order("desc");
  }

  return ctx.db
    .query("activityLogs")
    .withIndex("by_org", (q) => q.eq("orgId", orgId))
    .order("desc");
}

/* -------------------------------------------------- */
/* 📦 Formatting */
/* -------------------------------------------------- */

export async function formatActivityLog(ctx: Ctx, log: ActivityLogsI) {
  const [user, entityDetails] = await Promise.all([
    getUserSafe(ctx, log.userId),
    getEntitySafe(ctx,  log.entityId),
  ]);

  return {
    ...log,
    user: formatUser(user),
    entityDetails,
    metadata: parseMetadata(log.metadata),
  };
}

