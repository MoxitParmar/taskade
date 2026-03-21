
import { mutation } from "../_generated/server";
import { v } from "convex/values";


export const createOrganization = mutation({
    args: {
        clerkOrgId: v.string(),
        orgName: v.string(),
        imageUrl: v.string(),
    },

    handler: async (ctx, args) => {

        const existing = await ctx.db
            .query("organizations")
            .withIndex("by_clerk_org_id", (q) =>
                q.eq("clerkOrgId", args.clerkOrgId)
            )
            .unique();

        if (existing) {
            return existing._id;
        }

        const now = Date.now();

        const orgId = await ctx.db.insert("organizations", {
            clerkOrgId: args.clerkOrgId,
            orgName: args.orgName,
            imageUrl: args.imageUrl,
            createdAt: now,
            updatedAt: now,
        });
    


    return orgId;
  },
});

export const updateOrganization = mutation({
  args: {
    orgId: v.id("organizations"),
    orgName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const org = await ctx.db.get(args.orgId);

    if (!org) {
      throw new Error("Organization not found");
    }

    await ctx.db.patch(args.orgId, {
      orgName: args.orgName ?? org.orgName,
      imageUrl: args.imageUrl ?? org.imageUrl,
      updatedAt: Date.now(),
    });

    return args.orgId;
  },
});

// export const deleteOrganization = mutation({
//   args: {
//     orgId: v.id("organizations"),
//   },

//   handler: async (ctx, args) => {
//     const org = await ctx.db.get(args.orgId);


//     if (!org) {
//       throw new Error("Organization not found");
//     }

//     /* ---------------- PROJECTS ---------------- */

//     const projects = await ctx.db
//       .query("projects")
//       .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
//       .collect();

//     for (const project of projects) {

//       /* project memberships */
//       const pms = await ctx.db
//         .query("projectMemberships")
//         .withIndex("by_org_project", (q) => q.eq("orgId", args.orgId).eq("projectId", project._id))
//         .collect();

//       for (const pm of pms) {
//         await ctx.db.delete(pm._id);
//       }

//       /* tasks */
//       const tasks = await ctx.db
//         .query("tasks")
//         .withIndex("by_org_project", (q) => q.eq("orgId", args.orgId).eq("projectId", project._id))
//         .collect();

//       for (const task of tasks) {

//         /* comments */
//         const comments = await ctx.db
//           .query("taskComments")
//           .withIndex("by_task", (q) => q.eq("taskId", task._id))
//           .collect();

//         for (const comment of comments) {
//           await ctx.db.delete(comment._id);
//         }

//         /* activity logs for task */
//         const logs = await ctx.db
//           .query("activityLogs")
//           .withIndex("by_org_entity", (q) =>
//             q.eq("orgId", args.orgId).eq("entityType", "task").eq("entityId", task._id)
//           )
//           .collect();

//         for (const log of logs) {
//           await ctx.db.delete(log._id);
//         }

//         await ctx.db.delete(task._id);
//       }

//       await ctx.db.delete(project._id);
//     }

//     /* ---------------- MEMBERSHIPS ---------------- */

//     const memberships = await ctx.db
//       .query("memberships")
//       .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
//       .collect();

//     for (const membership of memberships) {
//       await ctx.db.delete(membership._id);
//     }

//     /* ---------------- ACTIVITY LOGS ---------------- */

//     const orgLogs = await ctx.db
//       .query("activityLogs")
//       .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
//       .collect();

//     for (const log of orgLogs) {
//       await ctx.db.delete(log._id);
//     }

//     /* ---------------- DELETE ORG ---------------- */

//     await ctx.db.delete(args.orgId);

//     return { success: true };
//   },
// });