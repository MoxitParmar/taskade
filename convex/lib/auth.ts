import { Id } from "../_generated/dataModel";
import { MutationCtx, query, QueryCtx } from "../_generated/server";
import { getOrgByClerkId } from "../organizations/queries";
import { getUserByClerkId } from "../users/queries";

export async function getUserData(ctx: MutationCtx | QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    return null;
  }

  const clerkUserId = identity.subject;
  const clerkOrgId =
    (identity as unknown as Record<string, string>).org_id ?? null;
  // find user
  const user = await getUserByClerkId(ctx, clerkUserId);

  if (!user) {
    return null;
  }
  let org;

  if (clerkOrgId) {
    // find organization
    org = await getOrgByClerkId(ctx, clerkOrgId);

    if (!org) {
      return null;
    }
  }

  return {
    clerkUserId,
    clerkOrgId,
    userId: user._id as Id<"users">,
    orgId: org?._id as Id<"organizations">,
    user,
    org,
  };
}

export const getViewerContext = query({
  args: {},
  handler: async (ctx) => {
    return await getUserData(ctx);
  },
});
