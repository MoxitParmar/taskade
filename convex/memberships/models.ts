import { Doc, Id } from "../_generated/dataModel";
import { QueryCtx, MutationCtx } from "../_generated/server";
import { getOrgSafe, formatOrg } from "../organizations/models";
import { getUserSafe, formatUser } from "../users/models";


type Ctx = QueryCtx | MutationCtx;
type MembershipI = Doc<"memberships">;
export interface Membership {
  _id: Id<"memberships">;
  createdAt: number;
  role: string;
  org: ReturnType<typeof formatOrg>;
  user: ReturnType<typeof formatUser>;
}

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

export async function formatMembership(ctx: Ctx, members: MembershipI) {
  const [user, org] = await Promise.all([
    getUserSafe(ctx, members.userId),
    getOrgSafe(ctx, members.orgId)
  ]);
  
  return {
    _id: members._id,
    createdAt: members._creationTime,
    role: members.role,
    org: formatOrg(org),
    user: formatUser(user),
  };
}
