import { query } from "@/convex/_generated/server";
import { getOrgMembers } from "../memberships/queries";
import { getUsersMemberships } from "../projects/models";
import { buildTasksQuery } from "../tasks/models";
import { getProjects } from "../projects/queries";
import { formatDate } from "@/lib/utils";
import { getActivityLogs } from "../activityLogs/queries";
import { getTasks } from "../tasks/queries";
import { v } from "convex/values";



const args = {
  userId: v.optional(v.id("users")),
  orgId: v.id("organizations"),
};

export const getMembersData = query({
  args,
  handler: async (ctx, { orgId }) => {
    return getOrgMembers(ctx, { orgId, paginate: false });
  },
});

export const getCardData = query({
  args: {userId: v.id("users"), orgId: v.id("organizations")},
  handler: async (ctx, { orgId, userId }) => {
    const now = Date.now();
 
    const usersProjectsP = getUsersMemberships(ctx, { orgId, userId })
      .collect()
      .then((rows) => rows.length);

    const activeP = buildTasksQuery(ctx, { orgId, userId }).then((q) =>
      q.filter((q) => q.eq(q.field("status"), "in-progress"))
        .collect()
        .then((rows) => rows.length)
    );

    const completedP = buildTasksQuery(ctx, { orgId, userId }).then((q) =>
      q.filter((q) => q.eq(q.field("status"), "completed"))
        .collect()
        .then((rows) => rows.length)
    );

    const overdueP = buildTasksQuery(ctx, { orgId, userId }).then((q) =>
      q.filter((q) => q.lt(q.field("dueDate"), now))
        .collect()
        .then((rows) => rows.length)
    );

    const [usersProjects, ActiveTasks, CompletedTasks, OverdueTasks] = await Promise.all([
      usersProjectsP,
      activeP,
      completedP,
      overdueP,
    ]);

    return { usersProjects, ActiveTasks, CompletedTasks, OverdueTasks };
  },
});

export const getProjectData = query({
  args,
  handler: async (ctx, { orgId, userId }) => {
    const projectsData = await getProjects(ctx, {
      orgId,
      userId,
      limit: 3,
      paginate: false,
    });

    return {
      ...projectsData,
      page: projectsData.page.map((p) => ({
        ...p,
        createdAt: formatDate(p ? p?.createdAt: 0),
        updatedAt: formatDate(p ? p.updatedAt : 0),
      })),
    };
  },
});

export const getOrgActivityData = query({
  args,
  handler: async (ctx, { orgId }) => {
    return getActivityLogs(ctx, { orgId, limit: 8, paginate: false });
  },
});

export const getUserTasksData = query({
  args,
  handler: async (ctx, { orgId, userId }) => {
    return getTasks(ctx, { orgId, userId, limit: 4, paginate: false });
  },
});