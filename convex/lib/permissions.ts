import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";
import { getMembership } from "../memberships/models";
import { getProjectById } from "../projects/queries";


export async function isAdmin(
  ctx: MutationCtx | QueryCtx,
  userId: Id<"users">,
  orgId: Id<"organizations">,
) {
  // find membership
  const membership = await getMembership(ctx, userId, orgId);

  if (membership?.role === "admin") {
    return true;
  }
    return false;
}

export async function isLead(ctx: MutationCtx | QueryCtx,
    userId: Id<"users">,
    projectId: Id<"projects">,
    orgId: Id<"organizations">,) {

  const project = await getProjectById(ctx, { projectId, orgId });

  if (await isAdmin(ctx, userId, orgId)) {
      return true;
  }
  if (project?.lead?._id == userId) {
      return true;
  }
  return false;
}
