import { v } from "convex/values";
import { query } from "../_generated/server";
import { getProjectById, getProjectMembers } from "../projects/queries";
import { getTasks } from "../tasks/queries";
import { buildTasksQuery } from "../tasks/models";
import { buildProjectMembers } from "../projects/models";
import { formatDate } from "@/lib/utils";


const args = {
  userId: v.optional(v.id("users")),
  orgId: v.id("organizations"),
  cursor: v.optional(v.string()),
  limit: v.optional(v.number()),
  status: v.optional(v.union(v.literal("todo"), v.literal("in-progress"), v.literal("done"))),
  priority: v.optional(v.union(v.literal("high"), v.literal("medium"), v.literal("low"))),
  assigneeId: v.optional(v.id("users")),
  projectId: v.optional(v.id("projects")),
};

export const getMembersData = query({
  args:{
  ...args,
    projectId: v.id("projects"),
} ,
  handler: async (ctx, { orgId , projectId}) => {
    return getProjectMembers(ctx, { orgId, paginate: false, projectId });
  },
});

export const getProject = query({
  args: {
    ...args,
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId , orgId}) => {
    return await getProjectById(ctx, { projectId, orgId });
  },
});

export const getCardData = query({
  args: {
    ...args,
    projectId: v.id("projects"),
  },
  handler: async (ctx, { orgId, userId, projectId }) => {
 
    const projectTasksP = await buildTasksQuery(ctx, { orgId, projectId }).then((q) =>
       q
      .collect()
      .then((rows) => rows.length));

    const activeTasksP = await buildTasksQuery(ctx, { orgId, projectId }).then((q) =>
      q.filter((q) => q.eq(q.field("status"), "in-progress"))
        .collect()
        .then((rows) => rows.length)
    );

    const completedTasksP = await buildTasksQuery(ctx, { orgId, projectId }).then((q) =>
      q.filter((q) => q.eq(q.field("status"), "completed"))
        .collect()
        .then((rows) => rows.length)
    );

    const projectMembersP = await buildProjectMembers(ctx, { orgId, projectId })
      .collect()
      .then((rows) => rows.length);

    const [projectTasks, activeTasks, completedTasks, projectMembers] = ([
      projectTasksP,
      activeTasksP,
      completedTasksP,
      projectMembersP,
    ]);

    return { projectTasks, activeTasks, completedTasks, projectMembers };
  },
});



export const getProjectTaskData = query({
  args,
  handler: async (ctx, { orgId, projectId, cursor, limit, status, priority, assigneeId }) => {
    const tasks = await getTasks(ctx, { orgId, projectId, cursor, limit, paginate: true, status, priority, assigneeId });
     return {
      ...tasks,
      page: tasks?.page?.map((p) => ({
        ...p,
        createdAt: formatDate(p ? p?.createdAt : 0),
        dueDate: formatDate(p ? p?.dueDate : 0),
      })),
    };
  },
});
