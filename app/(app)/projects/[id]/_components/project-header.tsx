"use client"
import { PageHeader } from "@/app/(app)/dashboard/_components/header";
import { useOrganization } from "@clerk/nextjs";
import { TaskDialog } from "./form/task-form-dialog";
import { Id } from "@/convex/_generated/dataModel";
import { Project, ProjectStatus } from "@/convex/projects/models";

export default function ProjectHeader({ project , projectId, userId, orgId }: { project: Project; projectId: Id<"projects">; userId: Id<"users">; orgId: Id<"organizations"> }) {

  const { membership } = useOrganization();
  const isAdmin = membership?.role === "org:admin";

  return (
    <>
        <PageHeader
          title={`${project?.name}`}
          subtitle={project?.description ?? "No description provided"}
          back={true}
          badge={project?.status as ProjectStatus}
          action={
            isAdmin && userId && orgId ? (
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