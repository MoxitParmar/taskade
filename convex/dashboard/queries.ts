import { query } from "@/convex/_generated/server";
import { getUserDataQuery } from "@/convex/lib/auth";
import { getOrgMembers } from "../memberships/queries";
import { getUsersMemberships } from "../projects/models";
import { buildTasksQuery } from "../tasks/models";

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
        
        return {
        userId,
        orgId,
        members,
        cardData,
      };
    }
  },
});
