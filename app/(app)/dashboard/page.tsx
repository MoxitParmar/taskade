"use client";
import { DashboardCard } from "./_components/dashboardCard";
import DashboardHeader from "./_components/header";

import { ProjectOverview } from "./_components/project-overview";
import { RecentActivity } from "./_components/recent-activity";
import TaskSummary from "./_components/task-summary";

export default function Dashboard() {
  return (
    <div>
      <DashboardHeader />
      <div className="grid gap-4 px-4 mt-8 grid-cols-2 lg:grid-cols-4 sm:px-8">
        <DashboardCard />
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 mt-6 sm:px-8 md:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-4">
          <ProjectOverview />
          <RecentActivity />
        </div>
        <TaskSummary />
      </div>
    </div>
  );
}
