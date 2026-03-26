import { MutationCtx, QueryCtx, query } from "../_generated/server";
import { v } from "convex/values";
type Ctx = QueryCtx | MutationCtx;


export async function getOrgByClerkId(
  ctx: Ctx,
  clerkOrgId: string
) {
   return await ctx.db
    .query("organizations")
    .withIndex("by_clerk_org_id", (q) =>
      q.eq("clerkOrgId", clerkOrgId)
    )
    .unique();
}

export const getOrgIdByClerkId = query({
  args: {
    clerkOrgId: v.string(),
  },
  handler: async (ctx, { clerkOrgId }) => {
    const org = await getOrgByClerkId(ctx, clerkOrgId);
    return org?._id ?? null;
  },
});