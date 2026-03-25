import { v } from "convex/values";
import { query } from "../_generated/server";
import { getProjectById, getProjectMembers } from "../projects/queries";


const args = {
  userId: v.optional(v.id("users")),
  orgId: v.id("organizations"),
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