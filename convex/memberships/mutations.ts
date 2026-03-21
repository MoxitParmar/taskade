import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";
import { MutationCtx } from "../_generated/server";

export async function createMembershipInternal(
  ctx: MutationCtx,
  userId: Id<"users">,
  orgId: Id<"organizations">,
  role: "admin" | "member" = "member"
) {
  const user = await ctx.db.get(userId);
  if (!user) throw new Error("User not found");

  const existing = await ctx.db
      .query("memberships")
      // eslint-disable-next-line
    .withIndex("by_user_org", (q: any) =>
      q.eq("userId", userId).eq("orgId", orgId),
    )
    .unique();

  if (existing) return existing._id;

  const now = Date.now();

  return await ctx.db.insert("memberships", {
    userId,
    orgId,
    role,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateMembershipRoleInternal(
  ctx: MutationCtx,
  userId: Id<"users">,
  orgId: Id<"organizations">,
  role: "admin" | "member"
) {
  const membership = await ctx.db
      .query("memberships")
      // eslint-disable-next-line
    .withIndex("by_user_org", (q: any) =>
      q.eq("userId", userId).eq("orgId", orgId),
    )
    .unique();

  if (!membership) {
    throw new Error("Membership not found");
  }

  await ctx.db.patch(membership._id, {
    role,
    updatedAt: Date.now(),
  });

  return ;
}

export async function deleteMembershipInternal(
  ctx: MutationCtx,
  userId: Id<"users">,
  orgId: Id<"organizations">,
) {
  const membership = await ctx.db
      .query("memberships")
      // eslint-disable-next-line
    .withIndex("by_user_org", (q: any) =>
      q.eq("userId", userId).eq("orgId", orgId),
    )
    .unique();

  if (!membership) {
    throw new Error("Membership not found");
  }

  await ctx.db.delete(membership._id);

  return membership._id;
}
export const createMembership = mutation({
  args: {
    clerkUserId: v.string(),
    clerkOrgId: v.string(),
    role: v.union(
      v.literal("admin"),
      v.literal("member")
    ),
  },

  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) =>
        q.eq("clerkUserId", args.clerkUserId),
      )
      .first();

    const org = await ctx.db
      .query("organizations")
      .withIndex("by_clerk_org_id", (q) => q.eq("clerkOrgId", args.clerkOrgId))
      .unique();

    if (!user) throw new Error("User not found");
    if (!org) throw new Error("Organization not found");

    return await createMembershipInternal(ctx, user._id, org._id, args.role);
  },
});

export const updateMembershipRole = mutation({
  args: {
    clerkUserId: v.string(),
    clerkOrgId: v.string(),
    role: v.union(
      v.literal("admin"),
      v.literal("member")
    ),
  },

  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) =>
        q.eq("clerkUserId", args.clerkUserId),
      )
      .first();

    const org = await ctx.db
      .query("organizations")
      .withIndex("by_clerk_org_id", (q) => q.eq("clerkOrgId", args.clerkOrgId))
      .unique();

    if (!user) throw new Error("User not found");
    if (!org) throw new Error("Organization not found");

    return await updateMembershipRoleInternal(ctx, user._id, org._id, args.role);
  },
});

export const deleteMembership = mutation({
  args: {
    clerkUserId: v.string(),
    clerkOrgId: v.string(),
  },

  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) =>
        q.eq("clerkUserId", args.clerkUserId),
      )
      .first();

    const org = await ctx.db
      .query("organizations")
      .withIndex("by_clerk_org_id", (q) => q.eq("clerkOrgId", args.clerkOrgId))
      .unique();

    if (!user) throw new Error("User not found");
    if (!org) throw new Error("Organization not found");

    return await deleteMembershipInternal(ctx, user._id, org._id);
  },
});
