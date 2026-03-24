// import { Doc } from "../_generated/dataModel";
// import { QueryCtx, MutationCtx } from "../_generated/server";
// import { Id } from "../_generated/dataModel";
// import { formatUser, getUserSafe } from "../users/models";
// import { formatOrg, getOrgSafe } from "../organizations/models";
// import schema from "../schema";
// import { stream } from "convex-helpers/server/stream";
// import { getProjectById } from "./queries";

// type Ctx = QueryCtx | MutationCtx;
// type Project = Doc<"projects">;

// export async function getProjectOrThrow(
//   ctx: Ctx,
//   projectId: Id<"projects">,
//   orgId: Id<"organizations">,
// ) {
//   const project = await ctx.db.get(projectId);

//   if (!project || project.orgId !== orgId) {
//     throw new Error("Project not found");
//   }

//   return project;
// }

// export async function getProjectSafe(ctx: Ctx, projectId: Id<"projects">) {
//   if (!projectId) return null;
//   return await ctx.db.get(projectId);
// }

// export async function formatProject(ctx: Ctx, project: Project) {
//     if (!project) return null;
//     if (!(project as Project)._id) {
//       // Already formatted (no _id), return directly
//       return project as Project;
//     }
//   const [lead, createdBy, org] = await Promise.all([
//     await getUserSafe(ctx, project.lead),
//     await getUserSafe(ctx, project.createdBy),
//     await getOrgSafe(ctx, project.orgId),
//   ]);
//   return {
//     id: project._id,
//     name: project.name,
//     description: project.description,
//     status: project.status,
//     createdAt: project.createdAt,
//     updatedAt: project.updatedAt,
//     lead: formatUser(lead),
//     createdBy: formatUser(createdBy),
//     org: formatOrg(org),
//   };
// }

// /* -------------------------------------------------- */
// /* 🧠 Query Builders */
// /* -------------------------------------------------- */

// export  function buildOrgProjectsQuery(
//   ctx: QueryCtx,
//   args: {
//     orgId: Id<"organizations">;
//     // userId?: Id<"users">;
//   },
// ) {
//   // if (args.userId) {
//   //    return  getUsersMemberships(ctx, {
//   //     orgId: args.orgId,
//   //     userId: args.userId,
//   //   });
//   // }
//   return ctx.db
//     .query("projects")
//     .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
//     .order("desc");
// }

// export function buildProjectMembers(
//   ctx: QueryCtx,
//   args: {
//     orgId: Id<"organizations">;
//     projectId: Id<"projects">;
//   },
// ) {
//   return ctx.db
//     .query("projectMemberships")
//     .withIndex("by_org_project", (q) =>
//       q.eq("orgId", args.orgId).eq("projectId", args.projectId),
//     )
//     .order("desc");
// }

// export function getProjectMembershipsByUser(
//   ctx: QueryCtx,
//   args: {
//     orgId: Id<"organizations">;
//     userId: Id<"users">;
//     projectId: Id<"projects">;
//   },
// ) {
//   return ctx.db
//     .query("projectMemberships")
//     .withIndex("by_org_project_user", (q) =>
//       q
//         .eq("orgId", args.orgId)
//         .eq("projectId", args.projectId)
//         .eq("userId", args.userId),
//     )
//     .first();
// }

// export function getUsersMemberships(
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

// export  function getUsersMembershipsInternal(
//     ctx: QueryCtx,
//     args: {
//         orgId: Id<"organizations">;
//         userId: Id<"users">;
//         search?: string;
//         status?: string;
//     },
// ) {
//     // build base stream over memberships
//     const baseStream = stream(ctx.db, schema)
//       .query("projectMemberships")
//       .withIndex("by_org_user", (q) =>
//         q.eq("orgId", args?.orgId).eq("userId", args?.userId),
//       )
//       .order("desc");

//     // map each membership to its project (async)
//     let q = baseStream.map((m) => getProjectById(ctx, m.projectId, args.orgId));

//     // use filterWith for async-aware filtering
//     if (args?.search) {
//         const searchLower = args.search.toLowerCase();
//         q = q.filterWith(async (p: Project | null) => {
//             if (!p) return false;
//             return p.name.toLowerCase().includes(searchLower);
//         });
//     }
    
//     if (args?.status) {
//         const status = args.status;
//         q = q.filterWith(async (p: Project | null) => {
//             if (!p) return false;
//             return p.status === status;
//         });
//     }
    
//     return q;
// }
import { Doc } from "../_generated/dataModel";
import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { formatUser, getUserSafe } from "../users/models";
import { formatOrg, getOrgSafe } from "../organizations/models";
import schema from "../schema";
import { stream } from "convex-helpers/server/stream";

type Ctx = QueryCtx | MutationCtx;
type Project = Doc<"projects">;

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

export async function formatProject(ctx: Ctx, project: Project) {
    if (!project) return null;
    if (!(project as Project)._id) {
      // Already formatted (no _id), return directly
      return project as Project;
    }
  const [lead, createdBy, org] = await Promise.all([
    await getUserSafe(ctx, project.lead),
    await getUserSafe(ctx, project.createdBy),
    await getOrgSafe(ctx, project.orgId),
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

export  function buildOrgProjectsQuery(
  ctx: QueryCtx,
  args: {
    orgId: Id<"organizations">;
    // userId?: Id<"users">;
  },
) {
  // if (args.userId) {
  //    return  getUsersMemberships(ctx, {
  //     orgId: args.orgId,
  //     userId: args.userId,
  //   });
  // }
  return ctx.db
    .query("projects")
    .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
    .order("desc");
}

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

export function getProjectMembershipsByUser(
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

export function getUsersMemberships(
  ctx: QueryCtx,
  args: {
    orgId: Id<"organizations">;
    userId: Id<"users">;
  },
) {
  return ctx.db
    .query("projectMemberships")
    .withIndex("by_org_user", (q) =>
      q.eq("orgId", args?.orgId).eq("userId", args?.userId),
    )
    .order("desc");
}

export function getUsersMembershipsInternal(
    ctx: QueryCtx,
    args: {
        orgId: Id<"organizations">;
        userId: Id<"users">;
        search?: string;
        status?: string;
    },
) {
    // Build a stream of project membership documents, then map to raw project docs (or null).
    // Use getProjectSafe to get raw DB project doc (so downstream formatting works as expected).
    const baseStream = stream(ctx.db, schema)
      .query("projectMemberships")
      .withIndex("by_org_user", (q) =>
        q.eq("orgId", args?.orgId).eq("userId", args?.userId),
      )
      .order("desc");

    // Map to raw project documents (Doc<"projects"> | null)
    let q = baseStream.map((m) => getProjectSafe(ctx, m.projectId));

    // Use filterWith (async-aware) over raw project docs.
    if (args?.search) {
        const searchLower = args.search.toLowerCase();
        q = q.filterWith(async (p: Project | null) => {
            if (!p) return false;
            return p.name.toLowerCase().includes(searchLower);
        });
    }
    
    if (args?.status) {
        const status = args.status;
        q = q.filterWith(async (p: Project | null) => {
            if (!p) return false;
            return p.status === status;
        });
    }
    
    return q;
}
