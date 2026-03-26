"use client"
import { useOrganization } from "@clerk/nextjs";
import { ProjectDialog } from "../../dashboard/_components/forms/project-form-dialog";
import { PageHeader } from "../../dashboard/_components/header";
import { Id } from "@/convex/_generated/dataModel";
import { HeaderSkeleton } from "../../dashboard/_components/skeleton/header";

export default function ProjectHeader({userId, orgId}: { userId: Id<"users">; orgId: Id<"organizations"> }) {

  const { membership } = useOrganization();
  const isAdmin = membership?.role === "org:admin";


  return (
    <>
      {!userId && !orgId ? (
        <HeaderSkeleton />
      ) : (
        <PageHeader
          title={`Projects`}
          subtitle="Manage and track your projects"
          action={
            isAdmin && userId && orgId ? (
              <ProjectDialog
                userId={userId }
                orgId={orgId}
              />
            ) : null
          }
        />
      )}
    </>
  );
}