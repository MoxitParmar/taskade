"use client";
import { useUserContext } from "@/hooks/use-user-context";
import { DashboardCard } from "./_components/dashboardCard";
import DashboardHeader from "./_components/header";

import { ProjectOverview } from "./_components/project-overview";
import { RecentActivity } from "./_components/recent-activity";
import TaskSummary from "./_components/task-summary";
import { Id } from "@/convex/_generated/dataModel";

export default function Dashboard() {
  const userData = useUserContext()?.data;
  const userId = userData?.userId as Id<"users">;
  const orgId = userData?.orgId as Id<"organizations">;
  return (
    <div>
      <DashboardHeader userId={userId} orgId={orgId} />
      <div className="grid gap-4 px-4 mt-8 grid-cols-2 lg:grid-cols-4 sm:px-8">
        <DashboardCard userId={userId} orgId={orgId} />
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 mt-6 sm:px-8 md:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-4">
          <ProjectOverview userId={userId} orgId={orgId} />
          <RecentActivity orgId={orgId} />
        </div>
        <TaskSummary userId={userId} orgId={orgId} />
      </div>
    </div>
  );
}
