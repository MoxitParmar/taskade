import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";


export async function isAdmin(
  ctx: MutationCtx | QueryCtx,
  userId: Id<"users">,
  orgId: Id<"organizations">,
) {
  // find membership
  const membership = await ctx.db
    .query("memberships")
    .withIndex("by_user_org", (q) => q.eq("userId", userId).eq("orgId", orgId))
    .unique();

  if (membership?.role === "admin") {
    return true;
  }
    return false;
}

export async function isLead(ctx: MutationCtx | QueryCtx,
    userId: Id<"users">,
    projectId: Id<"projects">,
    orgId: Id<"organizations">,) {

  const project = await ctx.db.get(projectId);

  if (await isAdmin(ctx, userId, orgId)) {
      return true;
  }
  if (project?.lead == userId) {
      return true;
  }
  return false;
}
