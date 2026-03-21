import { query } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { v } from "convex/values";

export const getProjectById = query({
  args: {
    projectId: v.id("projects"),
  },

  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    return project;
  },
});

export const getProjects = query({
  args: {
    userId: v.optional(v.id("users")),
    orgId: v.id("organizations"),
    cursor: v.optional(v.string()),
    limit: v.number(),
  },

  handler: async (ctx, args) => {
    let projectsQuery;
    if (args.userId) {
      projectsQuery = ctx.db
        .query("projectMemberships")
        .withIndex("by_org_user", (q) =>
          q.eq("orgId", args.orgId).eq("userId", args.userId as Id<"users">),
        )
        .order("desc");
    } else {
      projectsQuery = ctx.db
        .query("projectMemberships")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
        .order("desc");
    }

    const paginatedMemberships = await projectsQuery.paginate({
      numItems: args.limit,
      cursor: args.cursor ?? null,
    });

    const result = await Promise.all(
      paginatedMemberships.page.map(async (m) => {
        const project = await ctx.db.get(m.projectId);

        if (!project || project.orgId !== args.orgId) {
          return null;
        }

        return {
          id: project._id,
          name: project.name,
          description: project.description,
          lead: await ctx.db
            .get(project.lead)
            .then((user) => user ?? "Unknown"),
          status: project.status,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          createdBy: await ctx.db
            .get(project.createdBy)
            .then((user) => user ?? "Unknown"),
          org: await ctx.db.get(project.orgId).then((org) => org ?? "Unknown"),
        };
      }),
    );

    return {
      ...paginatedMemberships,
      page: result.filter(Boolean),
    };
  },
});

export const getProjectMembers = query({
  args: {
    orgId: v.id("organizations"),
    projectId: v.id("projects"),
    search: v.optional(v.string()),
    cursor: v.optional(v.string()),
    limit: v.number(),
  },

  handler: async (ctx, args) => {
    const memberships = ctx.db
      .query("projectMemberships")
      .withIndex("by_org_project", (q) =>
        q.eq("orgId", args.orgId).eq("projectId", args.projectId),
      )
      .order("desc");
    const paginatedMemberships = await memberships.paginate({
      numItems: args.limit,
      cursor: args.cursor ?? null,
    });

    const members = await Promise.all(
      paginatedMemberships.page.map(async (membership) => {
        let user;

        if (args.search) {
          user = await ctx.db.get(membership.userId).then((user) => {
            if (!user) return null;
            const searchLower = args.search!.toLowerCase();
            if (
              user.name.toLowerCase().includes(searchLower) ||
              user.email.toLowerCase().includes(searchLower)
            ) {
              return user;
            }
            return null;
          });
        } else {
          user = await ctx.db.get(membership.userId);
        }

        if (!user) {
          return null;
        }

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          imageUrl: user.imageUrl,
        };
      }),
    );

    return {
      ...paginatedMemberships,
      page: members.filter(Boolean),
    };
  },
});
