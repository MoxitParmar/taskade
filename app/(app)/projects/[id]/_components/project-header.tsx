"use client"
import { PageHeader } from "@/app/(app)/dashboard/_components/header";
import { HeaderSkeleton } from "@/app/(app)/dashboard/_components/skeleton/header";
import { useOrganization } from "@clerk/nextjs";
import { useUserContext } from "@/hooks/use-user-context";
import { TaskDialog } from "./form/task-form-dialog";
import { Id } from "@/convex/_generated/dataModel";

export default function ProjectHeader({ projectId }: { projectId: Id<"projects"> }) {
  const userData = useUserContext()?.data;
  const { membership } = useOrganization();
  const isAdmin = membership?.role === "org:admin";

  return (
    <>
      {/* {userData?.userId && userData?.orgId ? (
        <HeaderSkeleton />
      ) : ( */}
        <PageHeader
          title={`Projects`}
          subtitle="Manage and track your projects"
          back={true}
          badge={`active`}
          action={
            isAdmin && userData?.userId && userData?.orgId ? (
              <TaskDialog
                userId={userData.userId}
                orgId={userData.orgId}
                projectId={projectId}
              />
            ) : null
          }
        />
      {/* )} */}
    </>
  );
}