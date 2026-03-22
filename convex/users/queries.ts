
import {
  formatUser,
  getUserOrThrow,
} from "./models";
import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";
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