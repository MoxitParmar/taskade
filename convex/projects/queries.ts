import { Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import { paginateOrTake } from "../lib/paginateOrTake";
import { formatUser, getUserSafe } from "../users/models";
import { buildOrgProjectsQuery, buildProjectMembers,   formatProject, getProjectOrThrow } from "./models";

export async function getProjects(
  ctx: QueryCtx,
  args: {
    orgId: Id<"organizations">;
    userId?: Id<"users">;
    cursor?: string;
      limit?: number;
      paginate?: boolean
  }
) {
  const query = buildOrgProjectsQuery(ctx, args);

  return await paginateOrTake({
    query,
    ctx,
    limit: args.limit,
    cursor: args.cursor,
    paginate: args.paginate,
    map: (task) => formatProject(ctx, task),
  });
}

/* -------------------------------------------------- */
/* 🔍 Single Project */
/* -------------------------------------------------- */

export async function getProjectById(
  ctx: QueryCtx,
    projectId: Id<"projects">,
    orgId: Id<"organizations">
) {
    const project = await getProjectOrThrow(ctx, projectId, orgId);
    return await formatProject(ctx, project);
}

/* -------------------------------------------------- */
/* 👥 Project Members */
/* -------------------------------------------------- */

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
