import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  users: defineTable({
    clerkUserId: v.string(),
    name: v.string(),
    imageUrl: v.string(),
    email: v.string(),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
        .index("by_clerk_user_id", ["clerkUserId"]),

  organizations: defineTable({
    clerkOrgId: v.string(),
    imageUrl: v.string(),
    orgName: v.string(),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_clerk_org_id", ["clerkOrgId"]),

  memberships: defineTable({
    userId: v.id("users"),
    orgId: v.id("organizations"),
    role: v.union(
      v.literal("admin"),
      v.literal("member")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_user", ["userId"])
  .index("by_org", ["orgId"])
  .index("by_user_org", ["userId","orgId"]),

  projects: defineTable({
    orgId: v.id("organizations"),

    name: v.string(),
    description: v.string(),
    status: v.string(),

    createdBy: v.id("users"),
    lead: v.id("users"),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
      .index("by_org", ["orgId"])
  .index("by_org_created", ["orgId","createdAt"])
  .index("by_org_lead", ["orgId","lead"]),

  projectMemberships: defineTable({
    userId: v.id("users"),
    projectId: v.id("projects"),
    orgId: v.id("organizations"),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
  // .index("by_project", ["projectId"])
  .index("by_org_project", ["orgId","projectId"])
      .index("by_user", ["userId"])
      .index("by_org", ["orgId"])
  .index("by_org_user", ["orgId","userId"])
  .index("by_org_project_user", ["orgId","projectId","userId"]),

  tasks: defineTable({
    orgId: v.id("organizations"),
    projectId: v.id("projects"),

    name: v.string(),
    description: v.string(),

    status: v.union(
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("done")
    ),

    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),

    assignee: v.id("users"),
    dueDate: v.number(),

    createdBy: v.id("users"),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
  // .index("by_project", ["projectId"])
  .index("by_org", ["orgId"])
  .index("by_assignee", ["assignee"])
  // .index("by_project_assignee", ["projectId","assignee"])
  .index("by_org_project", ["orgId","projectId"])
  .index("by_org_assignee", ["orgId","assignee"]),

  taskComments: defineTable({
    orgId: v.id("organizations"),
    taskId: v.id("tasks"),

    content: v.string(),
    createdBy: v.id("users"),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_task", ["taskId"])
  .index("by_org", ["orgId"])
  .index("by_org_task", ["orgId","taskId"]),

  activityLogs: defineTable({
    orgId: v.id("organizations"),

    type: v.union(
      v.literal("task_created"),
      v.literal("task_updated"),
      v.literal("task_assigned"),
      v.literal("task_status_changed"),
      v.literal("comment_added")
    ),

    entityType: v.union(
      v.literal("task"),
      v.literal("comment")
      ),
    
    taskId: v.optional(v.id("tasks")),

    entityId: v.union(
      v.id("tasks"),
      v.id("taskComments")
    ),

    userId: v.id("users"),
    metadata: v.string(),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_org", ["orgId"])
      .index("by_org_task", ["orgId", "taskId"])
      .index("by_org_type", ["orgId","type"])
  .index("by_org_user", ["orgId","userId"])
  .index("by_org_entity", ["orgId","entityType","entityId"])

});