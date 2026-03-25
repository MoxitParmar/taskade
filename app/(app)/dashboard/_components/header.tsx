
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
import { User } from "@/convex/users/models";

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
  <div className="mt-8 flex flex-col gap-4 px-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
    <div className="flex items-start gap-3">
      {back && (
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ArrowLeft className="size-5" />
        </button>
      )}

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold leading-tight sm:text-3xl">
          <span>{title}</span>
          {badge && (
            <Badge
              variant="outline"
              className={cn(
                "ml-2 rounded-md px-2.5 py-0.5 align-middle text-xs font-semibold",
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
    </div>

    {action && <div className="sm:ml-auto">{action}</div>}
  </div>
);}

export type MemberSelectOption = {
  value: Id<"users">;
  label: string;
};

export default function DashboardHeader({userId, orgId}: {userId: Id<"users">, orgId: Id<"organizations">}) {
  const { data, isLoading } = useOrgMembersData({orgId, userId});
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
            isAdmin && userId && orgId ? (
              <ProjectDialog
                userId={userId}
                orgId={orgId}
              />
            ) : null
          }
        />
      )}
    </>
  );
}