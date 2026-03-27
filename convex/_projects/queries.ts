import { v } from "convex/values";
import { query } from "../_generated/server";
import { getProjects } from "../projects/queries";
import { formatDate } from "@/lib/utils";


const args = {
  userId: v.optional(v.id("users")),
    orgId: v.id("organizations"),
    search: v.optional(v.string()),
    status: v.optional(v.string()),
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
};

export const getProjectData = query({
  args,
  handler: async (ctx, { orgId, userId, search, status, cursor,limit }) => {
    const projectsData = await getProjects(ctx, {
      orgId,
        userId,
        search,
        status,
        cursor,
      limit,
      paginate: true,
    });

    return {
      ...projectsData,
      page: projectsData.page.map((p) => ({
        ...p,
        createdAt: formatDate(p ? p?.createdAt : 0),
        updatedAt: formatDate(p ? p?.updatedAt : 0),
      })),
    };
  },
});
