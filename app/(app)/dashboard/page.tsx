"use client";
import { ProjectDialog } from "./_components/forms/project-form-dialog";
import { PageHeader } from "./_components/header";
import { useDashboard } from "./_hooks/useDashboard";
import { HeaderSkeleton } from "./_components/skeleton/header";
import React from "react";
import { Id } from "@/convex/_generated/dataModel";
import { DashboardCard } from "./_components/dashboardCard";
import { dashboardCardData } from "./_hooks/cardObject";
import { DashboardCardsSkeleton } from "./_components/skeleton/dashboardCard";

export type MemberSelectOption = {
  value: Id<"users">;
  label: string;
};

export default function Dashboard() {
    const { userId, isAdmin, orgId, members, isLoading, user, cardData } = useDashboard();
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
            
            
    </>
  );
}
