import { Id } from "@/convex/_generated/dataModel";
import { useOrganization } from "@clerk/nextjs";
import { HeaderSkeleton } from "../../../dashboard/_components/skeleton/header";
import { InviteDialog } from "./invite-dialog";
import { PageHeader } from "@/components/PageHeader";

export default function SettingHeader({
  organization,
}: {
  organization: any;
}) {
  const { membership } = useOrganization();
  const isAdmin = membership?.role === "org:admin";
  return (
    <>
      { !organization ? (
        <HeaderSkeleton />
      ) : (
        <PageHeader
          title={`Settings`}
          subtitle="Manage and track your Organization settings"
          action={
            isAdmin && organization ? (
              <InviteDialog organization={organization} />
            ) : null
          }
        />
      )}
    </>
  );
}
