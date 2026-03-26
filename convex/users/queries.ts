
import {
  formatUser,
  getUserOrThrow,
} from "./models";
import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx, query } from "../_generated/server";
import { v } from "convex/values";
type Ctx = QueryCtx | MutationCtx;

export async function getUserByClerkId(
  ctx: Ctx,
  clerkUserId: string
) {
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q) =>
      q.eq("clerkUserId", clerkUserId)
    )
    .unique();
}

export async function getUserById(ctx: Ctx, userId: Id<"users">) {
    const user = await getUserOrThrow(ctx, userId);
    return formatUser(user);
}

export const getUserIdByClerkId = query({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, { clerkUserId }) => {
    const user = await getUserByClerkId(ctx, clerkUserId);
    return user?._id ?? null;
  },
});
