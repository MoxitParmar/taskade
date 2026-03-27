"use client";

import { Id } from "@/convex/_generated/dataModel";
import SettingHeader from "./_components/setting-header";
import { useUserContext } from "@/hooks/use-user-context";
import { useOrganization } from "@clerk/nextjs";
import SettingTabs from "./_components/setting-tabs";



export default function Settings() {
    const { organization, invitations } = useOrganization({
      memberships: { infinite: true },
      invitations: { infinite: true },
    });
    const userData = useUserContext()?.data;
    const userId = userData?.userId as Id<"users">;
    const orgId = userData?.orgId as Id<"organizations">;

  return (
    <div className="app-page">
          <SettingHeader organization={organization} />
          <SettingTabs organization={organization} orgId={orgId} userId={userId} invitations={invitations} />
    </div>
  );
}
