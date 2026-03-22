import { Id } from "../_generated/dataModel";
import { QueryCtx, MutationCtx } from "../_generated/server";


type Ctx = QueryCtx | MutationCtx;

export async function getMembership(
  ctx: Ctx,
  userId: Id<"users">,
  orgId: Id<"organizations">
) {
  return await ctx.db
    .query("memberships")
    .withIndex("by_user_org", (q) =>
      q.eq("userId", userId).eq("orgId", orgId)
    )
    .unique();
}