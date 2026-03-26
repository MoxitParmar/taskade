import { Doc} from "../_generated/dataModel";
import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

type Ctx = QueryCtx | MutationCtx;
type Organization = Doc<"organizations">;


export async function getOrgOrThrow(
  ctx: Ctx,
  orgId: Id<"organizations">
) {
    const org = await ctx.db.get(orgId);

  if (!org) {
    throw new Error("Organization not found");
  }

  return org;
}

export async function getOrgSafe(ctx: Ctx, orgId?: Id<"organizations"> | null) {
  if (!orgId) return null;
  return await ctx.db.get(orgId);
}

export function formatOrg(org: Organization | null) {
  if (!org) return "Unknown";

  return {
    _id: org._id,
      name: org.orgName,
      imageUrl: org.imageUrl,
    clerkOrgId: org.clerkOrgId,
  };
}




