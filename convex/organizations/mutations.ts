
import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { getOrgOrThrow } from "./models";
import { getOrgByClerkId } from "./queries";


export const createOrganization = mutation({
    args: {
        clerkOrgId: v.string(),
        orgName: v.string(),
        imageUrl: v.string(),
    },

    handler: async (ctx, args) => {

        const existing = await getOrgByClerkId(
            ctx,
            args.clerkOrgId
        );

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
    const org = await getOrgOrThrow(ctx, args.orgId);

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
//     await getOrgOrThrow(ctx, args.orgId);

//     /* ---------------- PROJECTS ---------------- */

//     const projects = await getProjects(ctx, { orgId: args.orgId , limit: 100});

//     for (const project of projects.page) {

//       /* project memberships */
//       const pms = await getProjectMembers(ctx, { projectId: project.id, orgId: args.orgId, limit: 500 });

//         for (const pm of pms.page) {
//           if (pm) {
//               await ctx.db.delete(pm.id);
//           }
//       }

//       /* tasks */
//     const tasks = await getTasks(ctx, { projectId: project.id, orgId: args.orgId, limit: 500 });

//       for (const task of tasks.page) {

//         /* comments */
//         const comments = await ctx.db
//           .query("taskComments")
//           .withIndex("by_task", (q) => q.eq("taskId", task.id))
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