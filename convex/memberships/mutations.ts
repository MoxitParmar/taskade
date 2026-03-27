import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";
import { MutationCtx } from "../_generated/server";
import { getUserOrThrow } from "../users/models";
import { getMembership } from "./models";
import { getUserByClerkId } from "../users/queries";
import { getOrgByClerkId } from "../organizations/queries";

export async function createMembershipInternal(
  ctx: MutationCtx,
  userId: Id<"users">,
  orgId: Id<"organizations">,
  role: "admin" | "member" = "member"
) {
await getUserOrThrow(ctx, userId);

  const existing = await getMembership(ctx, userId, orgId);

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
  const membership = await getMembership(ctx, userId, orgId);

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
  const membership = await getMembership(ctx, userId, orgId);

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
    const user = await getUserByClerkId(
      ctx,
      args.clerkUserId
    );

    const org = await getOrgByClerkId(
      ctx,
      args.clerkOrgId
    );

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
    const user = await getUserByClerkId(
      ctx,
      args.clerkUserId
    );

    const org = await getOrgByClerkId(
      ctx,
      args.clerkOrgId
    );

    if (!user) throw new Error("User not found");
    if (!org) throw new Error("Organization not found");

    return await updateMembershipRoleInternal(ctx, user._id, org._id, args.role);
  },
});

export const deleteMembershipByClerkId = mutation({
  args: {
    clerkUserId: v.string(),
    clerkOrgId: v.string(),
  },

  handler: async (ctx, args) => {
    const user = await getUserByClerkId(
      ctx,
      args.clerkUserId
    );

    const org = await getOrgByClerkId(
      ctx,
      args.clerkOrgId
    );

    if (!user) throw new Error("User not found");
    if (!org) throw new Error("Organization not found");

    return await deleteMembershipInternal(ctx, user._id, org._id);
  },
});

export const deleteMembership = mutation({
  args: {
    userId: v.id("users"),
    orgId: v.id("organizations"),
  },

  handler: async (ctx, args) => {
    return await deleteMembershipInternal(ctx, args.userId, args.orgId);
  },
});
