import { query } from "@/convex/_generated/server";
import { getUserDataQuery } from "@/convex/lib/auth";
import { getOrgMembers } from "../memberships/queries";
import { getUsersMemberships } from "../projects/models";
import { buildTasksQuery } from "../tasks/models";
import { getProjects } from "../projects/queries";
import { formatDate } from "@/lib/utils";
import { getActivityLogs } from "../activityLogs/queries";
import { getTasks } from "../tasks/queries";

export const getDashboardData = query({
  args: {},

  handler: async (ctx) => {
    const data = await getUserDataQuery(ctx);
    const { userId, orgId } = data ?? {};
    if (orgId && userId) {
      const members = await getOrgMembers(ctx, { orgId, paginate: false });

      const now = Date.now();
      const usersProjects = await getUsersMemberships(ctx, { orgId, userId })
        .collect()
        .then((rows) => rows.length);
      
        const ActiveTasks = await buildTasksQuery(ctx, {
            orgId,
            userId,
        }).then((q) => q.filter((q) => q.eq(q.field("status"), "in-progress")).collect()
            .then((rows) => rows.length))
        
        const CompletedTasks = await buildTasksQuery(ctx, {
            orgId,
            userId,
        }).then((q) => q.filter((q) => q.eq(q.field("status"), "completed")).collect()
            .then((rows) => rows.length))
        
        const OverdueTasks = await buildTasksQuery(ctx, {
            orgId,
            userId,
        }).then((q) => q.filter((q) => q.lt(q.field("dueDate"), now)).collect()
            .then((rows) => rows.length))
        
        const cardData = {
            usersProjects,
            ActiveTasks,
            CompletedTasks,
            OverdueTasks,
        }
        
        const projectsData = await getProjects(ctx, { orgId, userId, limit: 3, paginate: false });
        
        const projects = {
          ...projectsData,
          page: projectsData.page.map((p) => ({
            ...p,
              createdAt: formatDate(p.createdAt),
              updatedAt: formatDate(p.updatedAt),
          })),
        };
        
        const orgActivity = await getActivityLogs(ctx, { orgId, limit: 8, paginate: false });
        
        const userTasks = await getTasks(ctx, { orgId, userId, limit: 4, paginate: false });
        
        return {
        userId,
        orgId,
        members,
        cardData,
        projects,
        orgActivity,
        userTasks,
      };
    }
  },
});
