"use client";

import { Suspense } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useUserContext } from "@/hooks/use-user-context";
import { useOrganization } from "@clerk/nextjs";
import SettingTabs from "./_components/SettingTabs/setting-tabs";
import SettingHeader from "./_components/Header/setting-header";



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
          <Suspense fallback={null}>
            <SettingTabs organization={organization} orgId={orgId} userId={userId} invitations={invitations} />
          </Suspense>
    </div>
  );
}
