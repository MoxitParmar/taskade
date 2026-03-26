import { Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import { paginateOrTake } from "../lib/paginateOrTake";
import { formatUser, getUserSafe } from "../users/models";
import { buildOrgProjectsQuery, buildProjectMembers,   formatProject, getProjectOrThrow, getUserProjectMemberships } from "./models";

export async function getProjects(
  ctx: QueryCtx,
  args: {
    orgId: Id<"organizations">;
    userId?: Id<"users">;
      cursor?: string;
      search?: string;
      status?: string;
      limit?: number;
      paginate?: boolean
  }
) {
   
    if (args.userId) {
        const membershipQuery = getUserProjectMemberships(ctx, {
            orgId: args.orgId,
            userId: args.userId,
            search: args.search,
            status: args.status,
        });
        return await paginateOrTake({
            query: membershipQuery,
            ctx,
            limit: args.limit,
            cursor: args.cursor,
            paginate: args.paginate,
            map: (p) => formatProject(ctx, p),
        });
    } else {
    
        const query = buildOrgProjectsQuery(ctx, {
            orgId: args.orgId,
        });
    
        return await paginateOrTake({
            query,
            ctx,
            limit: args.limit,
            cursor: args.cursor,
            paginate: args.paginate,
            map: (p) => formatProject(ctx, p),
        });
    }
}

export async function getProjectById(
  ctx: QueryCtx,
  args: {
    projectId: Id<"projects">,
    orgId: Id<"organizations">,
    userId?: Id<"users">
  }
) {
    const project = await getProjectOrThrow(ctx, args.projectId, args.orgId);
    return await formatProject(ctx, project);
}

export async function getProjectMembers(
  ctx: QueryCtx,
  args: {
    orgId: Id<"organizations">;
    projectId: Id<"projects">;
    search?: string;
    cursor?: string;
      limit?: number;
        paginate?: boolean;
  }
) {
    const query = buildProjectMembers(ctx, {
        orgId: args.orgId,
        projectId: args.projectId,
    });

    const result = await paginateOrTake({
      query,
      ctx,
      limit: args.limit,
      cursor: args.cursor,
      paginate: args.paginate,
  
      map: async (membership) => {
        const user = await getUserSafe(ctx, membership.userId);
        if (!user) return null;
  
        if (args.search) {
          const search = args.search.toLowerCase();
  
          if (
            !user.name.toLowerCase().includes(search) &&
            !user.email.toLowerCase().includes(search)
          ) {
            return null;
          }
        }
  
        return formatUser(user);
      },
    });
  
    return {
      ...result,
      page: result.page.filter(Boolean),
    };
  }
