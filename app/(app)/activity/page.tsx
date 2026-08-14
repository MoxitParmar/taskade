"use client";
import { use } from 'react';
import { Id } from '@/convex/_generated/dataModel';

import { useUserContext } from '@/hooks/use-user-context';
import ActivityHeader from './_components/activity-header';
import React from 'react';
import { useSmartUrlSync } from '@/hooks/use-smart-url-sync';
import TaskToolbar from './_components/activity-toolbar';
import ActivityToolbar from './_components/activity-toolbar';
import { Membership } from '@/convex/memberships/models';
import { useOrgMembersData } from '../dashboard/_hooks/useDashboard';
import { RecentActivity } from './_components/activity';
type ActivityQueryState = {
  assignee: string;
  type: string;
  page: string;
};
export default function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const userData = useUserContext()?.data;
  const userId = userData?.userId as Id<"users">;
  const orgId = userData?.orgId as Id<"organizations">;
    const { data} = useOrgMembersData({orgId, userId});
      const memberOptions = React.useMemo(() => {
        return (
          (data?.page ?? [])
            .filter((m: Membership) => m?.user?._id && m?.user?.name)
            .map((m: Membership) => ({
              value: m.user ? m.user._id : "",
              label: m.user ? m.user.name : "",
            }))
        );
      }, [data?.page]);
   const defaultQueryState = React.useMemo<ActivityQueryState>(
        () => ({
          assignee: "",
          type: "",
          page: "1",
        }),
        [],
      );
  
      const [queryState, setQueryState] = React.useState<ActivityQueryState>(defaultQueryState);
  
      const { setQueryValue, reset } = useSmartUrlSync<ActivityQueryState>({
        state: queryState,
        setState: setQueryState,
        keys: ["assignee", "type", "page"],
        defaultState: defaultQueryState,
        debouncedKeys: ["assignee", "type"],
        debounceMs: 350,
        method: "replace",
        pageParam: "page",
        resetPageOn: ["assignee", "type"],
      });
  return (
    <div className="app-page flex flex-col gap-6 mb-10">

        <ActivityHeader  />
              <div className="flex flex-col gap-2 md:flex-row md:items-start">
                <ActivityToolbar
                  type={queryState.type}
                  onTypeChange={(value) => setQueryValue("type", value)}
                  assignee={queryState.assignee}
                  onAssigneeChange={(value) => setQueryValue("assignee", value)}
                  assigneeOptions={memberOptions}
                  onReset={reset}
                />
                </div>
                <RecentActivity
                    type={queryState.type as "comment" | "task"}
                    assignee={queryState.assignee as Id<"users">}
                    orgId={orgId}
                    userId={userId}
                />

    </div>
  )
}
