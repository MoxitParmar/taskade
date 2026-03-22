
import { QueryCtx, MutationCtx } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";

type Ctx = QueryCtx | MutationCtx;
export type User = Doc<"users">;


export async function getUserOrThrow(ctx: Ctx, userId: Id<"users">) {
  const user = await ctx.db.get(userId);

  if (!user) throw new Error("User not found");

  return user;
}

export function formatUser(user: User | null) {
  if (!user) return null;

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    imageUrl: user.imageUrl,
  };
}

export async function getUserSafe(ctx: Ctx, userId?: Id<"users"> | null) {
  if (!userId) return null;
  return await ctx.db.get(userId);
}