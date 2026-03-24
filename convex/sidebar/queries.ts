import { query } from "@/convex/_generated/server";
import { getProjects } from "@/convex/projects/queries";
import { getTasks } from "@/convex/tasks/queries";
import { v } from "convex/values";

const args = {
  userId: v.id("users"),
  orgId: v.id("organizations"),
};

export const getSidebarData = query({
    args,
  handler: async (ctx, args) => {
        const {userId, orgId} = args ?? {};
        if (orgId && userId) {
            const tasks = await getTasks(ctx, { userId,  orgId, limit: 5,  paginate: false });
            const projects = await getProjects(ctx, {  orgId,userId, limit: 5, paginate: false });
            return { tasks, projects };
        }
  },
});