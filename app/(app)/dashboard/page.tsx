"use client";
import { ProjectDialog } from "./_components/forms/project-form-dialog";
import { PageHeader } from "./_components/header";
import { useDashboard } from "./_hooks/useDashboard";
import { HeaderSkeleton } from "./_components/skeleton/header";
import React from "react";
import { Id } from "@/convex/_generated/dataModel";
import { DashboardCard } from "./_components/dashboardCard";
import { dashboardCardData } from "./_config/cardObject";
import { DashboardCardsSkeleton } from "./_components/skeleton/dashboardCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectOverview } from "./_components/project-overview";
import { RecentActivity } from "./_components/recent-activity";
import { TaskSummaryCard } from "./_components/task-summary";
import { mapUserTasksToSummary } from "./_config/task-summary";

export type MemberSelectOption = {
  value: Id<"users">;
  label: string;
};

export default function Dashboard() {
    const { userId, isAdmin, orgId, members, isLoading, user, cardData, projects, orgActivity, userTasks } = useDashboard();
    const memberOptions = React.useMemo(() => {
        return (
            (members?.page ?? [])
                //eslint-disable-next-line
                .filter((m: any) => m?.user?.id && m?.user?.name)
                //eslint-disable-next-line
                .map((m: any) => ({
                    value: m.user.id,
                    label: m.user.name,
                }))
        );
    }, [members]);

    const CardData =
    //eslint-disable-next-line
        dashboardCardData?.map((card: any) => {
            if (card.title === "Total Projects") {
                return {
                    ...card,
                    value: cardData?.usersProjects,
                }
            } else if (card.title === "Active Tasks") {
                return {
                    ...card,
                    value: cardData?.ActiveTasks,
                }
            } else if (card.title === "Completed Tasks") {
                return {
                    ...card,
                    value: cardData?.CompletedTasks,
                }
            } else if (card.title === "Overdue") {
                return {
                    ...card,
                    value: cardData?.OverdueTasks,
                }
            } else {
                return card;
            }
        })
    const taskSummaryData = mapUserTasksToSummary(userTasks?.page);
    return (
    <>
      {isLoading ? (
        <HeaderSkeleton />
      ) : (
        <PageHeader
          title={`Welcome back, ${user?.firstName ?? "User"}`}
          subtitle="A quick overview of your projects today"
          action={
            isAdmin ? (
              <ProjectDialog
                userId={userId}
                orgId={orgId}
                members={memberOptions}
              />
            ) : null
          }
        />
      )}

      <div className="grid gap-4 px-4 mt-8 grid-cols-2 lg:grid-cols-4 sm:px-8">
        {isLoading ? (
          <DashboardCardsSkeleton />
        ) : (
          <DashboardCard data={CardData} />
        )}
        </div>
            
        <div className="grid grid-cols-1 gap-4 px-4 mt-6 sm:px-8 md:grid-cols-[2fr_1fr]">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            {isLoading ? (
              <Skeleton className="h-64 w-full rounded-xl" />
            ) : (
              <ProjectOverview data={projects?.page} />
            )}
            {isLoading ? (
              <Skeleton className="h-64 w-full rounded-xl" />
            ) : (
              <RecentActivity data={orgActivity?.page} />
            )}
          </div>
  
          {/* Right Column */}
          <div className="flex flex-col gap-4">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full rounded-xl" />
                ))
              : taskSummaryData.map((config) => (
                  <TaskSummaryCard key={config.title} config={config} />
                ))}
          </div>
        </div>    
    </>
  );
}
