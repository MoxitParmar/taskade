import { api } from "../_generated/api";
import { httpAction } from "../_generated/server";
import { verifyWebhook } from '@clerk/backend/webhooks'



export const clerkWebhook = httpAction(async (ctx, request) => {
  const event = await verifyWebhook(request);
  if (!event) {
    return new Response("Error occured", { status: 400 });
  }
  // eslint-disable-next-line
  const data: any = event.data;

  switch (event.type) {
    
    
    case "user.created": {
      await ctx.runMutation(api.users.mutations.createUser, {
        clerkUserId: data.id,
        email: data.email_addresses?.[0]?.email_address ?? "",
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`,
        imageUrl: data.image_url,
      });
      break;
    }
    case "user.updated": {
      const userId = await ctx.runQuery(api.users.queries.getUserIdByClerkId, {
        clerkUserId: data.id,
      });
      if (userId) {
        await ctx.runMutation(api.users.mutations.updateUser, {
          userId,
          email: data.email_addresses?.[0]?.email_address ?? "",
          name: `${data.first_name ?? ""} ${data.last_name ?? ""}`,
          imageUrl: data.image_url,
        });
      }
      break;
    }
    case "user.deleted": {
      const userId = await ctx.runQuery(api.users.queries.getUserIdByClerkId, {
        clerkUserId: data.id,
      });
      if (userId) {
        await ctx.runMutation(api.users.mutations.deleteUser, {
          userId,
        });
      }
      break;
    }

    case "organization.created": {
      await ctx.runMutation(api.organizations.mutations.createOrganization, {
        clerkOrgId: data.id,
        orgName: data.name,
        imageUrl: data.image_url ?? "",
      });
      break;
    }

    case "organization.updated": {
      const orgId = await ctx.runQuery(api.organizations.queries.getOrgIdByClerkId, {
        clerkOrgId: data.id,
      });
      if (orgId) {
        await ctx.runMutation(api.organizations.mutations.updateOrganization, {
          orgId,
          orgName: data.name,
          imageUrl: data.image_url ?? "",
        });
      }
      break;
    }

    // case "organization.deleted": {
    //   const org = await getOrgByClerkId(ctx as QueryCtx, data.id);
    //   const orgId = org?._id;
    //   if (orgId) {
    //     await (ctx as MutationCtx).runMutation(api.organizations.mutations.deleteOrganization, {
    //       orgId,
    //     });
    //   }
    //   break;
    // }
    case "organizationMembership.created": {
      const orgRole = (data.role as string).replace("org:", "");
     // Ensure organization exists even if organization.created webhook arrives later
  await ctx.runMutation(api.organizations.mutations.createOrganization, {
    clerkOrgId: data.organization.id,
    orgName: data.organization.name ?? "Unnamed Organization",
    imageUrl: data.organization.image_url ?? "",
  });

  // Ensure user exists as well (same race can happen for user.created)
  await ctx.runMutation(api.users.mutations.createUser, {
    clerkUserId: data.public_user_data.user_id,
    email: data.public_user_data.identifier ?? "",
    name: `${data.public_user_data.first_name ?? ""} ${data.public_user_data.last_name ?? ""}`.trim(),
    imageUrl: data.public_user_data.image_url ?? "",
  });

  await ctx.runMutation(api.memberships.mutations.createMembership, {
    clerkUserId: data.public_user_data.user_id,
    clerkOrgId: data.organization.id,
    role: orgRole as "admin" | "member",
  });
  break;
    }

    case "organizationMembership.updated": {
      const orgRole = (data.role as string).replace("org:", "");
      await ctx.runMutation(api.memberships.mutations.updateMembershipRole, {
        clerkUserId: data.public_user_data.user_id,
        clerkOrgId: data.organization.id,
        role: orgRole as "admin" | "member",
      });
      break;
    }

    // case "organizationMembership.deleted": {
    //   await ctx.runMutation(api.memberships.mutations.deleteMembership, {
    //     clerkUserId: data.public_user_data.user_id,
    //     clerkOrgId: data.organization.id,
    //   });
    //   break;
    // }

    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }
  return new Response(null, { status: 200 });
});
