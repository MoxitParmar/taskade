
import { Id } from "@/convex/_generated/dataModel";
import { useOrganization, useUser } from "@clerk/nextjs";
import React from "react";
import { ReactNode } from "react";
import { useOrgMembersData } from "../_hooks/useOrgMembersData";
import { ProjectDialog } from "./forms/project-form-dialog";
import { HeaderSkeleton } from "./skeleton/header";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
    action?: ReactNode;
};

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
    return (
      <div className="flex flex-col gap-4 px-4 mt-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}

      </div>
  );
}

export type MemberSelectOption = {
  value: Id<"users">;
  label: string;
};

export default function DashboardHeader() {
  const { data, isLoading, userData } = useOrgMembersData();
  const { membership } = useOrganization();
  const isAdmin = membership?.role === "org:admin";
  const { user } = useUser();


  const memberOptions = React.useMemo(() => {
    return (
      (data?.page ?? [])
        //eslint-disable-next-line
        .filter((m: any) => m?.user?.id && m?.user?.name)
        //eslint-disable-next-line
        .map((m: any) => ({
          value: m.user.id,
          label: m.user.name,
        }))
    );
  }, [data?.page]);

  return (
    <>
      {isLoading ? (
        <HeaderSkeleton />
      ) : (
        <PageHeader
          title={`Welcome back, ${user?.firstName ?? "User"}`}
          subtitle="A quick overview of your projects today"
          action={
            isAdmin && userData?.userId && userData?.orgId ? (
              <ProjectDialog
                userId={userData.userId}
                orgId={userData.orgId}
                members={memberOptions}
              />
            ) : null
          }
        />
      )}
    </>
  );
}