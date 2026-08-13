import { Id } from "@/convex/_generated/dataModel";
import { useOrganization } from "@clerk/nextjs";
import { PageHeader } from "../../../dashboard/_components/header";
import { HeaderSkeleton } from "../../../dashboard/_components/skeleton/header";
import { InviteDialog } from "./invite-dialog";

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
