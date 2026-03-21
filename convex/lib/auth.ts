import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";


export async function getUserDataQuery(ctx: MutationCtx | QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    return null
  }

  // if (!identity.orgId) {
  //   throw new Error("Organization required");
  // }

  const clerkUserId = identity.subject;
  const clerkOrgId = (identity as unknown as Record<string, string>).org_id ?? null;
  // find user
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", clerkUserId))
    .unique();

  if (!user) {
    return null
  }
  let org;

  if(clerkOrgId){

  // find organization
   org = await ctx.db
    .query("organizations")
    .withIndex("by_clerk_org_id", (q) =>
      q.eq("clerkOrgId", clerkOrgId as string),
    )
    .unique();

  if (!org) {
    return null
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