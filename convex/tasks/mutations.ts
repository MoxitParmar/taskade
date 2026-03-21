import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { logActivity, createTaskMetadata, deleteActivityLogs } from "../lib/activityLogs";



// create task
export const createTask = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("done"),
    ),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    assignee: v.id("users"),
    dueDate: v.number(),
    createdBy: v.id("users"),
        projectId: v.id("projects"),
        userId: v.id("users"),   orgId: v.id("organizations"),
    
  },

  handler: async (ctx, args) => {
    const now = Date.now();

    // create task
    const taskId = await ctx.db.insert("tasks", {
      orgId: args.orgId,
      projectId: args.projectId,

      name: args.name,
      description: args.description,
      status: args.status,
      priority: args.priority,
      assignee: args.assignee,
      dueDate: args.dueDate,
      createdBy: args.userId,

      createdAt: now,
      updatedAt: now,
    });
    
    await logActivity(ctx, {
      type: "task_created",
      entityType: "task",
      entityId: taskId,
      userId: args.userId,
      taskId,
      orgId: args.orgId,
      metadata: createTaskMetadata({
              name: args.name,
              status: args.status,
              priority: args.priority,
              assigneeName: (await ctx.db.get(args.assignee))?.name,
            }),
    });

    return taskId;
  },
});

export const updateTask = mutation({
    args: {
        taskId: v.id("tasks"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        status: v.optional(v.union(
            v.literal("todo"),
            v.literal("in-progress"),
            v.literal("done"),
          )),
        priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
        assignee: v.optional(v.id("users")),
        dueDate: v.optional(v.number()),
        userId: v.id("users"),   orgId: v.id("organizations"),
    },

    handler: async (ctx, args) => {
        const {userId, orgId} = args
       
        const now = Date.now();

        // find task
        const task = await ctx.db.query("tasks").withIndex("by_id", (q) => q.eq("_id", args.taskId)).first();

        if (!task) {
            throw new Error("Task not found");
        }

        if (task.orgId !== orgId) {
            throw new Error("You do not have access to this task");
        }
        
        // Track changes for metadata
        // eslint-disable-next-line 
        const changes: Record<string, { from: any; to: any }> = {};
        
        if (args.name && args.name !== task.name) {
            changes.name = { from: task.name, to: args.name };
        }
        if (args.status && args.status !== task.status) {
            changes.status = { from: task.status, to: args.status };
        }
        if (args.priority && args.priority !== task.priority) {
            changes.priority = { from: task.priority, to: args.priority };
        }
        if (args.assignee && args.assignee !== task.assignee) {
            const oldAssignee = await ctx.db.get(task.assignee);
            const newAssignee = await ctx.db.get(args.assignee);
            changes.assignee = { 
                from: oldAssignee?.name, 
                to: newAssignee?.name 
            };
        }

        // update task
         await ctx.db.patch("tasks",task._id, {
            name: args.name ?? task.name,
            description: args.description ?? task.description,
            status: args.status ?? task.status,
            priority: args.priority ?? task.priority,
            assignee: args.assignee ?? task.assignee,
            dueDate: args.dueDate ?? task.dueDate,
            updatedAt: now,
         });
        
         // Log appropriate activity based on what changed
         if (args.assignee && args.assignee !== task.assignee) {
             await logActivity(ctx, {
                 type: "task_assigned",
                 entityType: "task",
                 entityId: task._id,
                 userId: userId,
                 taskId: task._id,
                 orgId,
                 metadata: createTaskMetadata({
                     name: task.name,
                     assigneeName: changes.assignee?.to,
                     changes,
                 }),
             });
         }
    },
});

export const deleteTask = mutation({
    args: {
        taskId: v.id("tasks"),
          orgId: v.id("organizations"),
    },

    handler: async (ctx, args) => {
        const { orgId } = args;

        // find task
        const task = await ctx.db.query("tasks").withIndex("by_id", (q) => q.eq("_id", args.taskId)).first();

        if (!task) {
            throw new Error("Task not found");
        }

        if (task.orgId !== orgId) {
            throw new Error("You do not have access to this task");
        }

        
        // delete task
        await ctx.db.delete("tasks",task._id);
        await deleteActivityLogs(ctx, { orgId }, args.taskId);

        return true;
    },
});
