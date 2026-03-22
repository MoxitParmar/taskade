import { Doc} from "../_generated/dataModel";
import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { formatUser, getUserSafe } from "../users/models";
import { formatOrg, getOrgSafe } from "../organizations/models";

type Ctx = QueryCtx | MutationCtx;
type Project = Doc<"projects">;



export async function getProjectOrThrow(
  ctx: Ctx,
  projectId: Id<"projects">,
  orgId: Id<"organizations">
) {
  const project = await ctx.db.get(projectId);

  if (!project || project.orgId !== orgId) {
    throw new Error("Project not found");
  }

  return project;
}


export async function getProjectSafe(
  ctx: Ctx,
  projectId: Id<"projects">
) {
    if (!projectId) return null;
  return await ctx.db.get(projectId);
}






export async function formatProject(ctx: Ctx, project: Project) {
  const [lead, createdBy, org] = await Promise.all([
    getUserSafe(ctx, project.lead),
    getUserSafe(ctx, project.createdBy),
    getOrgSafe(ctx, project.orgId),
  ]);

  return {
    id: project._id,
    name: project.name,
    description: project.description,
    status: project.status,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    lead: formatUser(lead),
    createdBy: formatUser(createdBy),
    org: formatOrg(org),
  };
}

/* -------------------------------------------------- */
/* 🧠 Query Builders */
/* -------------------------------------------------- */

export function buildOrgProjectsQuery(
  ctx: QueryCtx,
  args: {
    orgId: Id<"organizations">;
    userId?: Id<"users">;
  }
) {
  if (args.userId) {
    return ctx.db
      .query("projectMemberships")
      .withIndex("by_org_user", (q) =>
        q.eq("orgId", args.orgId).eq("userId", args.userId!)
      )
      .order("desc");
  }

  return ctx.db
    .query("projectMemberships")
    .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
    .order("desc");
}

export function buildProjectMembers(
  ctx: QueryCtx,
  args: {
    orgId: Id<"organizations">;
    projectId: Id<"projects">;
  }
) {

  return ctx.db
     .query("projectMemberships")
     .withIndex("by_org_project", (q) =>
       q.eq("orgId", args.orgId).eq("projectId", args.projectId)
     )
     .order("desc");
}


export function getProjectMembershipsByUser(
  ctx: QueryCtx,
  args: {
    orgId: Id<"organizations">;
      userId: Id<"users">;
    projectId: Id<"projects">;
  }
) {

  return ctx.db
     .query("projectMemberships")
     .withIndex("by_org_project_user", (q) =>
       q.eq("orgId", args.orgId).eq("projectId", args.projectId).eq("userId", args.userId)
      )
      .first();
}
