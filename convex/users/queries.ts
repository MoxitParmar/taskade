import { query } from "../_generated/server";

import { v } from "convex/values";
import { getUserDataQuery } from "../lib/auth";
import { isAdmin } from "../lib/permissions";


export const getUserIdByClerkId = query({
  args: {
    clerkUserId: v.string(),
  },

  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    return user._id;
  },
});

export const getUserDataById = query({
  args: {
    userId: v.id("users"),
  },

  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
    };
  },
});

export const getUserData = query({
  handler: async (ctx) => {
    const userData = await getUserDataQuery(ctx);
    return userData
  },
});

export const isUserAdmin = query({
args: {
  userId: v.id("users"),
  orgId: v.id("organizations"),
},
handler: async (ctx, args) => {
    const { userId, orgId } = args;
    const authData = await isAdmin(ctx, userId, orgId);
    return authData;
}
});