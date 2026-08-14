"use client"

import { Id } from "@/convex/_generated/dataModel";
import { Project, ProjectStatus } from "@/convex/projects/models";
import { TaskDialog } from "../../../task/[id]/_components/Forms/TaskForms/dialogs/task-form-dialog";
import { PageHeader } from "@/components/PageHeader";

export default function ProjectHeader({ project , projectId, userId, orgId }: { project: Project; projectId: Id<"projects">; userId: Id<"users">; orgId: Id<"organizations"> }) {
  return (
    <>
        <PageHeader
          title={`${project?.name}`}
          subtitle={project?.description ?? "No description provided"}
          back={true}
          badge={project?.status as ProjectStatus}
          action={
             userId && orgId ? (
              <TaskDialog
                userId={userId}
                orgId={orgId}
                projectId={projectId}
              />
            ) : null
          }
        />

    </>
  );
}