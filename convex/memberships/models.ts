import { Doc, Id } from "../_generated/dataModel";
import { QueryCtx, MutationCtx } from "../_generated/server";
import { getOrgSafe, formatOrg } from "../organizations/models";
import { getUserSafe, formatUser } from "../users/models";


type Ctx = QueryCtx | MutationCtx;
export type Membership = Doc<"memberships">;

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

export async function formatMembership(ctx: Ctx, members: Membership) {
  const [user, org] = await Promise.all([
    getUserSafe(ctx, members.userId),
    getOrgSafe(ctx, members.orgId)
  ]);
  
  return {
    id: members._id,
    createdAt: members._creationTime,
    role: members.role,
    org: formatOrg(org),
    user: formatUser(user),
  };
}