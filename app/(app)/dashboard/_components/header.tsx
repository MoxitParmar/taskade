
import { Id } from "@/convex/_generated/dataModel";
import { useOrganization, useUser } from "@clerk/nextjs";
import React from "react";
import { ReactNode } from "react";
import { useOrgMembersData } from "../_hooks/useOrgMembersData";
import { ProjectDialog } from "./forms/project-form-dialog";
import { HeaderSkeleton } from "./skeleton/header";
import { Badge } from "@/components/ui/badge";
import { ProjectStatus, projectStatusStyles } from "../_config/projects";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
    action?: ReactNode;
    badge?: ProjectStatus;
    back?: boolean;
};

export function PageHeader({ title, subtitle, action, badge, back }: PageHeaderProps) {
  
  const config = badge ? projectStatusStyles[badge] : undefined;

return (
  <div className="flex flex-col gap-4 px-8 mt-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
    {back && (
      <div className="flex items-baseline gap-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ArrowLeft className="size-5" />
        </button>
      </div>
    )}

    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold sm:text-3xl">
        {title}
        {badge && (
          <Badge
            variant="outline"
            className={cn(
              "rounded-md mt-1.5 px-2.5 py-0.5 text-xs font-semibold",
              config?.badgeClass
            )}
          >
            {config?.label}
          </Badge>
        )}
      </h1>
      {subtitle && (
        <p className="text-sm text-muted-foreground sm:text-base">{subtitle}</p>
      )}
    </div>

    {action && <div>{action}</div>}
  </div>
);}

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