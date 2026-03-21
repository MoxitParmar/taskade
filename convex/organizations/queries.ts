import { query } from "../_generated/server";



import { v } from "convex/values";


export const getOrgIdByClerkId = query({
  args: {
    clerkOrgId: v.string(),
  },

  handler: async (ctx, args) => {
    const org = await ctx.db
      .query("organizations")
      .withIndex("by_clerk_org_id", (q) =>
        q.eq("clerkOrgId", args.clerkOrgId)
      )
      .unique();

    if (!org) {
      throw new Error("Organization not found");
    }

    return org._id;
  },
});