import { Doc } from "../_generated/dataModel";
import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { formatUser, getUserSafe } from "../users/models";
import { formatOrg, getOrgSafe } from "../organizations/models";
import schema from "../schema";
import { stream } from "convex-helpers/server/stream";

type Ctx = QueryCtx | MutationCtx;
type ProjectI = Doc<"projects">;
export interface Project {
  _id: Id<"projects">;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt: number;
  updatedAt: number;
  lead: ReturnType<typeof formatUser>;
  createdBy: ReturnType<typeof formatUser>;
  org: ReturnType<typeof formatOrg>;
  members?: number | string[] | null | undefined;
}

export type ProjectStatus =
  | "planning"
  | "active"
  | "on-hold"
  | "completed"

export async function getProjectOrThrow(
  ctx: Ctx,
  projectId: Id<"projects">,
  orgId: Id<"organizations">,
) {
  const project = await ctx.db.get(projectId);

  if (!project || project.orgId !== orgId) {
    throw new Error("Project not found");
  }

  return project;
}

export async function getProjectSafe(ctx: Ctx, projectId: Id<"projects">) {
  if (!projectId) return null;
  return await ctx.db.get(projectId);
}

export async function formatProject(ctx: Ctx, project: ProjectI) {
  const [lead, createdBy, org] = await Promise.all([
    await getUserSafe(ctx, project.lead),
    await getUserSafe(ctx, project.createdBy),
    await getOrgSafe(ctx, project.orgId),
  ]);
  return {
    _id: project._id,
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





export  function buildOrgProjectsQuery(
  ctx: QueryCtx,
  args: {
    orgId: Id<"organizations">;
  },
) {

  return ctx.db
    .query("projects")
    .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
    .order("desc");
}

// get all project members
export function buildProjectMembers(
  ctx: QueryCtx,
  args: {
    orgId: Id<"organizations">;
    projectId: Id<"projects">;
  },
) {
  return ctx.db
    .query("projectMemberships")
    .withIndex("by_org_project", (q) =>
      q.eq("orgId", args.orgId).eq("projectId", args.projectId),
    )
    .order("desc");
}

// check if user is a member of the project
export function getProjectMembershipVerification(
  ctx: QueryCtx,
  args: {
    orgId: Id<"organizations">;
    userId: Id<"users">;
    projectId: Id<"projects">;
  },
) {
  return ctx.db
    .query("projectMemberships")
    .withIndex("by_org_project_user", (q) =>
      q
        .eq("orgId", args.orgId)
        .eq("projectId", args.projectId)
        .eq("userId", args.userId),
    )
    .first();
}

// // get all projects a user is a member of
// export function getUserProjectMemberships(
//   ctx: QueryCtx,
//   args: {
//     orgId: Id<"organizations">;
//     userId: Id<"users">;
//   },
// ) {
//   return ctx.db
//     .query("projectMemberships")
//     .withIndex("by_org_user", (q) =>
//       q.eq("orgId", args?.orgId).eq("userId", args?.userId),
//     )
//     .order("desc");
// }

// get all projects a user is a member of with search and status filter
export function getUserProjectMemberships(
    ctx: QueryCtx,
    args: {
        orgId: Id<"organizations">;
        userId: Id<"users">;
        search?: string;
        status?: string;
    },
) {
    
    // first of all get all the project memberships for the user.
    const baseStream = stream(ctx.db, schema)
      .query("projectMemberships")
      .withIndex("by_org_user", (q) =>
        q.eq("orgId", args?.orgId).eq("userId", args?.userId),
      )
      .order("desc");

    // now here we get all the projects from the projectIds.
    let q = baseStream.map((m) => getProjectSafe(ctx, m.projectId));

    // Use filterWith to filter projects based on search and status.
    if (args?.search) {
        const searchLower = args.search.toLowerCase();
        q = q.filterWith(async (p: ProjectI | null) => {
            if (!p) return false;
            return p.name.toLowerCase().includes(searchLower);
        });
    }
    
    if (args?.status) {
        const status = args.status;
        q = q.filterWith(async (p: ProjectI | null) => {
            if (!p) return false;
            return p.status === status;
        });
    }
    
    return q;
}
