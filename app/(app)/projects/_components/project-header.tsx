"use client"
import { useOrganization } from "@clerk/nextjs";

import { Id } from "@/convex/_generated/dataModel";
import { HeaderSkeleton } from "../../dashboard/_components/skeleton/header";
import { CreateProjectDialog } from "./form/ProjectForm/create-project-dialog";
import { PageHeader } from "@/components/PageHeader";


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
              <CreateProjectDialog
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