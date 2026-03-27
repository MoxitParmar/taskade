import { v } from "convex/values";
import { query } from "../_generated/server";
import { getOrgMembers } from "../memberships/queries";
import { formatDate } from "@/lib/utils";

const args = {
  userId: v.optional(v.id("users")),
  orgId: v.id("organizations"),
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
};

export const getMembersData = query({
  args,
  handler: async (ctx, { orgId, cursor, limit }) => {
    const members = await getOrgMembers(ctx, { orgId,cursor,limit, paginate: true });
    return {
        ...members,
    };
  },
});
