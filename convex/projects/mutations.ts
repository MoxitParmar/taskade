import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { isAdmin, isLead } from "../lib/permissions";
import {  getProjectMembershipsByUser, getProjectOrThrow } from "./models";


// create project
export const createProject = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    status: v.string(),
        lead: v.id("users"),
    userId: v.id("users"),   orgId: v.id("organizations"),
  },

  handler: async (ctx, args) => {
      if (!isAdmin(ctx, args.userId, args.orgId)) {
          throw new Error("You do not have permission to create a project in this organization");
      }
      
          const now = Date.now();

          // create project
          const projectId = await ctx.db.insert("projects", {
              orgId: args.orgId,

              name: args.name,
              description: args.description,
              status: args.status,

              createdBy: args.userId,
              lead: args.lead,

              createdAt: now,
              updatedAt: now,
          });

          // add admin as project member
          await ctx.db.insert("projectMemberships", {
              userId: args.userId,
              projectId,
              orgId: args.orgId,

              createdAt: now,
              updatedAt: now,
          });

          // add lead as project member
          if (args.lead !== args.userId) {
              await ctx.db.insert("projectMemberships", {
                  userId: args.lead,
                  projectId,
                  orgId: args.orgId,
                  createdAt: now,
                  updatedAt: now
              })
          }

          return projectId;
      } 
  },
);

export const updateProject = mutation({
    args: {
        projectId: v.id("projects"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        status: v.optional(v.string()),
        lead: v.optional(v.id("users")),
        userId: v.id("users"),   orgId: v.id("organizations"),
    },

    handler: async (ctx, args) => {
        if(!isLead(ctx, args.userId,args.projectId, args.orgId )){
            throw new Error("You do not have permission to update this project");
        }
        const now = Date.now();

        // find project
        const project = await getProjectOrThrow(ctx, args.projectId, args.orgId);


        // update project
        await ctx.db.patch("projects", args.projectId, {
            name: args.name ?? project.name,
            description: args.description ?? project.description,
            status: args.status ?? project.status,
            lead: args.lead ?? project.lead,
            updatedAt: now,
        });

        return args.projectId;
    },
});

export const deleteProject = mutation({
    args: {
        projectId: v.id("projects"),
        userId: v.id("users"),   orgId: v.id("organizations"),
    },

    handler: async (ctx, args) => {
        if(!isAdmin(ctx, args.userId, args.orgId)){
            throw new Error("You do not have permission to delete this project");
        }

        getProjectOrThrow(ctx, args.projectId, args.orgId);
        
        // delete project
        await ctx.db.delete("projects", args.projectId);
        
        //delete project memberships
        const memberships = await ctx.db.query("projectMemberships")
            .withIndex("by_org_project", (q) => q.eq("orgId", args.orgId).eq("projectId", args.projectId))
            .collect();

        for(const membership of memberships){
            await ctx.db.delete("projectMemberships", membership._id);
        }

        return args.projectId;
    },
});

export const addProjectMember = mutation({
    args: {
        projectId: v.id("projects"),
        userId: v.id("users"),
            orgId: v.id("organizations"),
    },

    handler: async (ctx, args) => {
        if(!isLead(ctx, args.userId,args.projectId, args.orgId )){
            throw new Error("You do not have permission to add members to this project");
        }
        const now = Date.now();

        // find project
        await getProjectOrThrow(ctx, args.projectId, args.orgId);

        // prevent duplicate membership
        const existingMembership = await getProjectMembershipsByUser(ctx, {
            orgId: args.orgId,
            userId: args.userId,
            projectId: args.projectId,
        });

        if (existingMembership) {
            throw new Error("User is already a member of this project");
        }

        // add project member
        await ctx.db.insert("projectMemberships", {
            userId: args.userId,
            projectId: args.projectId,
            orgId: args.orgId,
            createdAt: now,
            updatedAt: now,
        });
    },
});

export const removeProjectMember = mutation({
    args: {
        projectId: v.id("projects"),
        userId: v.id("users"),
        orgId: v.id("organizations"),
    },

    handler: async (ctx, args) => {
        if(!isLead(ctx, args.userId,args.projectId, args.orgId )){
            throw new Error("You do not have permission to remove members from this project");
        }

        // find project
        await getProjectOrThrow(ctx, args.projectId, args.orgId);

        // remove project member
        const membership = await getProjectMembershipsByUser(ctx, {
            orgId: args.orgId,
            userId: args.userId,
            projectId: args.projectId,
        });
        
        if(membership){
            await ctx.db.delete("projectMemberships", membership._id);
        }
    },
});