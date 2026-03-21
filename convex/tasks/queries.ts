import { query } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { v } from "convex/values";
import { api } from "../_generated/api";

export const getTasks = query({
  args: {
      cursor: v.optional(v.string()),
      limit: v.number(),
    projectId: v.optional(v.id("projects")),
    clerkuserId: v.optional(v.id("users")),
    userId: v.id("users"),   orgId: v.id("organizations"),
  },

  handler: async (ctx, args) => {
    
    const { userId, orgId } = args;

    let tasksQuery;

    // Decide which index to use
    if (args.projectId) {
      const project = await ctx.db.get(args.projectId);

      if (!project || project.orgId !== orgId) {
        throw new Error("Project not found");
      }

      tasksQuery = ctx.db
        .query("tasks")
        .withIndex("by_org_project", (q) => q.eq("orgId", orgId).eq("projectId", args.projectId as Id<"projects">))
        .order("desc");
    } else if (args.clerkuserId) {
      const userId: Id<"users"> = await ctx.runQuery(api.users.queries.getUserIdByClerkId, {
              clerkUserId: args.clerkuserId,
            })
      const user = await ctx.db.get(userId);

      if (!user) {
        throw new Error("User not found");
      }

      tasksQuery = ctx.db
        .query("tasks")
        .withIndex("by_org_assignee", (q) => q.eq("orgId", orgId).eq("assignee", userId as Id<"users">))
        .order("desc");
    } else {
      // default: tasks assigned to current user
      tasksQuery = ctx.db
        .query("tasks")
        .withIndex("by_org_assignee", (q) => q.eq("orgId", orgId).eq("assignee", userId as Id<"users">))
        .order("desc");
    }

    const paginatedTasks = await tasksQuery.paginate({
          numItems: args.limit,
          cursor: args.cursor ?? null,
        });

    const result = await Promise.all(
      paginatedTasks.page.map(async (task) => {
        const assignee = task.assignee
          ? await ctx.db.get(task.assignee)
          : null;

        const formattedAssignee = assignee
          ? {
              id: assignee._id,
              name: assignee.name,
              email: assignee.email,
              imageUrl: assignee.imageUrl,
            }
          : null;

        const project = await ctx.db.get(task.projectId);

        return {
          id: task._id,
          createdAt: task._creationTime,
          name: task.name,
          description: task.description,
          status: task.status,
          priority: task.priority,
          isOverdue: task.dueDate ? Date.now() > task.dueDate : false,
          dueDate: task.dueDate,
          project: project
            ? { id: project._id, name: project.name }
            : null,
          assignee: formattedAssignee,
        };
      })
    );

    return {
      ...paginatedTasks,
      page: result,
    };
  }
});

export const getTaskById = query({
  args: {
    taskId: v.id("tasks"),
  },

  handler: async (ctx, args) => {
      const task = await ctx.db.get(args.taskId);

      if (!task) {
        throw new Error("Task not found");
      }

      const assignee = task.assignee
        ? await ctx.db.get(task.assignee)
        : null;

      const formattedAssignee = assignee
        ? {
            id: assignee._id,
            name: assignee.name,
            email: assignee.email,
            imageUrl: assignee.imageUrl,
          }
        : null;

      const project = await ctx.db.get(task.projectId);
      const lead = project?.lead ? await ctx.db.get(project.lead) : null;

      const formattedProject = project
        ? {
            ...project,
            lead: lead
              ? {
                  id: lead._id,
                  name: lead.name,
                  email: lead.email,
                  imageUrl: lead.imageUrl,
                }
              : null,
          }
        : null;

      return {
        id: task._id,
        createdAt: task._creationTime,
        name: task.name,
        description: task.description,
        status: task.status,
        priority: task.priority,
        isOverdue: task.dueDate ? Date.now() > task.dueDate : false,
        dueDate: task.dueDate,
        project: formattedProject,
        assignee: formattedAssignee,
      };
    },
});