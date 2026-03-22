import { MutationCtx, QueryCtx } from "../_generated/server";
type Ctx = QueryCtx | MutationCtx;


export async function getOrgByClerkId(
  ctx: Ctx,
  clerkOrgId: string
) {
   const org = await ctx.db
    .query("organizations")
    .withIndex("by_clerk_org_id", (q) =>
      q.eq("clerkOrgId", clerkOrgId)
    )
    .unique();
   
    if (!org) {
        throw new Error("Organization not found");
    }
    
    return org;
}