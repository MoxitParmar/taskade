import { v } from "convex/values";
import { query } from "../_generated/server";
// import { getProjectById } from "../projects/queries";
import { getTasks, getTaskById } from "../tasks/queries";
import { buildTasksQuery } from "../tasks/models";
// import { buildProjectMembers } from "../projects/models";
import { formatDate } from "@/lib/utils";
import { getTaskComments } from "../comments/queries";


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

// export const getMembersData = query({
//   args:{
//   ...args,
//     projectId: v.id("projects"),
// } ,
//   handler: async (ctx, { orgId , projectId}) => {
//     const pro = await getProjectMembers(ctx, { orgId, paginate: false, projectId });
//     return pro;
//   },
// });

export const getComments = query({
  args: {
    ...args,
    taskId: v.id("tasks"),
  },
  handler: async (ctx, { taskId, orgId }) => {
    const comments = await getTaskComments(ctx, { taskId, orgId, paginate: false });
    comments?.page.forEach((c) => {
      c.createdAt = formatDate(c?.createdAt) as unknown as number;
    });
    return comments;
  },
});