import { v } from "convex/values";
import { query } from "../_generated/server";
import { Id } from "../_generated/dataModel";


export const getOrgActivityLogs = query({
  args: {
        cursor: v.optional(v.string()),
        limit: v.number(),
        userId: v.id("users"),
        orgId: v.id("organizations"),
        entityType: v.optional(v.string()),
        type: v.optional(v.string()),
        userIdFilter: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    
      const {  orgId } = args;
      let result;
    
    if(args.entityType) {
        result = await ctx.db
        .query("activityLogs")
        .withIndex("by_org_entity", (q) => q.eq("orgId", orgId).eq("entityType", args.entityType as "task" | "comment"))
        .order("desc")
        .paginate({
            numItems: args.limit,
            cursor: args.cursor ?? null,
      });
    } else if(args.type) {
        result = await ctx.db
        .query("activityLogs")
        .withIndex("by_org_type", (q) => q.eq("orgId", orgId).eq("type", args.type as "task_created" | "task_updated" | "task_assigned" | "task_status_changed" | "comment_added"))
        .order("desc")
        .paginate({
            numItems: args.limit,
            cursor: args.cursor ?? null,
      });
    } else if(args.userIdFilter) {
        result = await ctx.db
        .query("activityLogs")
        .withIndex("by_org_user", (q) => q.eq("orgId", orgId).eq("userId", args.userIdFilter as Id<"users">))
        .order("desc")
        .paginate({
            numItems: args.limit,
            cursor: args.cursor ?? null,
      });
    } else {
        result = await ctx.db
        .query("activityLogs")
        .withIndex("by_org", (q) => q.eq("orgId", orgId))
        .order("desc")
        .paginate({
            numItems: args.limit,
            cursor: args.cursor ?? null,
      });
    }
      // Enrich logs with related data
    const enrichedLogs = await Promise.all(
      result.page.map(async (log) => {
        const user = await ctx.db.get(log.userId);

        // Get entity details based on type
        let entityDetails = null;
        if (log.entityType === "task") {
          //eslint-disable-next-line
          entityDetails = await ctx.db.get(log.entityId as any);
        } else if (log.entityType === "comment") {
          //eslint-disable-next-line
          entityDetails = await ctx.db.get(log.entityId as any);
        }

        return {
          ...log,
          user: user
            ? { _id: user._id, name: user.name, imageUrl: user.imageUrl }
            : null,
          entityDetails,
          metadata: JSON.parse(log.metadata),
        };
      }),
    );

    return {
      ...result,
      page: enrichedLogs,
    };
  },
});

