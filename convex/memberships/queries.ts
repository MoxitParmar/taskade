import {  Id } from "../_generated/dataModel";
import { QueryCtx, MutationCtx } from "../_generated/server";
import { paginateOrTake } from "../lib/paginateOrTake";
import { formatMembership } from "./models";

type Ctx = QueryCtx | MutationCtx;

export async function getOrgMembers(ctx: Ctx, args: {
    cursor?: string;
    limit?: number;
    orgId: Id<"organizations">;
    paginate?: boolean;
} ) {
    const query =  ctx.db.query("memberships")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
        .order("desc")
    
    
    return await paginateOrTake({
      query,
      ctx,
      limit: args.limit,
      cursor: args.cursor,
      paginate: args.paginate,
      map: (m) => formatMembership(ctx, m),
    });
}