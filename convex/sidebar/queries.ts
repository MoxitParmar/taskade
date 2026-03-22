import { query } from "@/convex/_generated/server";
import { getUserDataQuery } from "@/convex/lib/auth";
import { getProjects } from "@/convex/projects/queries";
import { getTasks } from "@/convex/tasks/queries";


export const getSidebarData = query({
    args: {},
    
  handler: async (ctx) => {
        const user = await getUserDataQuery(ctx);
        const {userId, orgId} = user ?? {};
        if (orgId && userId) {
            const tasks = await getTasks(ctx, { userId,  orgId, limit: 5,  paginate: false });
            const projects = await getProjects(ctx, { userId,  orgId, limit: 5,  paginate: false });
            return { tasks, projects };
        }
  },
});