
import { Id } from "@/convex/_generated/dataModel";
import { useOrganization, useUser } from "@clerk/nextjs";
import { HeaderSkeleton } from "./skeleton/header";
import { CreateProjectDialog } from "../../projects/_components/form/ProjectForm/create-project-dialog";
import { PageHeader } from "@/components/PageHeader";


export default function DashboardHeader({userId, orgId}: {userId: Id<"users">, orgId: Id<"organizations">}) {
  const { membership } = useOrganization();
  const isAdmin = membership?.role === "org:admin";
  const { user } = useUser();

  return (
    <>
      {!user?.firstName ? (
        <HeaderSkeleton />
      ) : (
        <PageHeader
          title={`Welcome back, ${user?.firstName ?? "User"}`}
          subtitle="A quick overview of your projects today"
          action={
            isAdmin && userId && orgId ? (
              <CreateProjectDialog
                userId={userId}
                orgId={orgId}
              />
            ) : null
          }
        />
      )}
    </>
  );
}