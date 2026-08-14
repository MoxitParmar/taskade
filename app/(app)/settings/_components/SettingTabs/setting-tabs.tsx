"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Users } from "lucide-react";
import { useSmartUrlSync } from "@/hooks/use-smart-url-sync";


import { Id } from "@/convex/_generated/dataModel";
import { useOrgMembersData } from "../../_hooks/useSettings";
import Invitations from "./InvititionTab/Invititions-tab";
import Members from "./MembersTab/members-tab";

type SettingTabsQueryState = {
  tab: "Members" | "Invitations";
};

const TAB_VALUES: SettingTabsQueryState["tab"][] = ["Members", "Invitations"];

export default function SettingTabs({organization, invitations, userId, orgId}: {organization: any; invitations: any; userId: Id<"users">; orgId: Id<"organizations">}) {
  const defaultQueryState = React.useMemo<SettingTabsQueryState>(
    () => ({ tab: "Members" }),
    [],
  );
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const [queryState, setQueryState] =
    React.useState<SettingTabsQueryState>(defaultQueryState);

  const { setQueryValue } = useSmartUrlSync<SettingTabsQueryState>({
    state: queryState,
    setState: setQueryState,
    keys: ["tab"],
    defaultState: defaultQueryState,
    method: "replace",
  });

  const currentTab = TAB_VALUES.includes(queryState.tab)
    ? queryState.tab
    : defaultQueryState.tab;

  return (
    <div>
      {isMounted && orgId && (
        <Tabs
          value={currentTab}
          onValueChange={(value) =>
            setQueryValue("tab", value as SettingTabsQueryState["tab"])
          }
        >
          <TabsList variant="default" className="mt-8">
            <TabsTrigger value="Members" className="cursor-pointer">
              <Users className="size-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="Invitations" className="cursor-pointer">
              <UserPlus className="size-4" />
              Invitations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="Members">
            <div className="flex flex-col  justify-center rounded-xl border-border/60">
              <Members
                organization={organization}
                orgId={orgId}
                userId={userId}
              />
            </div>
          </TabsContent>
          <TabsContent value="Invitations">
            <div className="flex flex-col  justify-center rounded-xl border-border/60">
              <Invitations invitations={invitations} />
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
