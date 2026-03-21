
import { Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    clerkUserId: v.string(),
    name: v.string(),
    imageUrl: v.string(),
    email: v.string(),
  },

  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) =>
        q.eq("clerkUserId", args.clerkUserId)
      )
      .unique();

    if (existingUser) {
      return existingUser._id;
    }

    const now = Date.now();

    const userId = await ctx.db.insert("users", {
      clerkUserId: args.clerkUserId,
      name: args.name,
      imageUrl: args.imageUrl,
      email: args.email,
      createdAt: now,
      updatedAt: now,
    });

    return userId;
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    email: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const { userId, ...fields } = args;
    const user  = ctx.db.get(userId);

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(userId as Id<"users">, {
      ...fields,
      updatedAt: Date.now(),
    });

    return ;
  },
});

// export const deleteUser = mutation({
//   args: {
//     userId: v.id("users"),
//   },

//   handler: async (ctx, args) => {
//     const user = await ctx.db.get(args.userId);

//     if (!user) {
//       throw new Error("User not found");
//     }

//     /* ---------------- MEMBERSHIPS ---------------- */

//     const memberships = await ctx.db
//       .query("memberships")
//       .withIndex("by_user", (q) => q.eq("userId", args.userId))
//       .collect();

//     for (const membership of memberships) {
//       await ctx.db.delete(membership._id);
//     }
//     /* ---------------- PROJECT MEMBERSHIPS ---------------- */

//     const projectMemberships = await ctx.db
//       .query("projectMemberships")
//       .withIndex("by_org_user", (q) => q.eq("orgId", memberships[0]?.orgId).eq("userId", args.userId))
//       .collect();

//     for (const pm of projectMemberships) {
//       await ctx.db.delete(pm._id);
//     }

//     /* ---------------- TASKS ASSIGNED ---------------- */

//     const assignedTasks = await ctx.db
//       .query("tasks")
//       .withIndex("by_org_assignee", (q) => q.eq("orgId", memberships[0]?.orgId).eq("assignee", args.userId))
//       .collect();

//     for (const task of assignedTasks) {
//       await ctx.db.patch(task._id, {
//         assignee: task.createdBy,
//         updatedAt: Date.now(),
//       });
//     }

//     /* ---------------- COMMENTS ---------------- */

//     const comments = await ctx.db
//       .query("taskComments")
//       .withIndex("by_org", (q) => q.eq("orgId", memberships[0]?.orgId))
//       .collect();

//     for (const comment of comments) {
//       if (comment.createdBy === args.userId) {
//         await ctx.db.delete(comment._id);
//       }
//     }

//     /* ---------------- ACTIVITY LOGS ---------------- */

//     const logs = await ctx.db
//       .query("activityLogs")
//       .withIndex("by_org_user", (q) => q.eq("orgId", memberships[0]?.orgId).eq("userId", args.userId))
//       .collect();

//     for (const log of logs) {
//       await ctx.db.delete(log._id);
//     }
    

//     /* ---------------- DELETE USER ---------------- */

//     await ctx.db.delete(args.userId);

//     return { success: true };
//   },
// });