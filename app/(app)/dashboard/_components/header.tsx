
import { Id } from "@/convex/_generated/dataModel";
import { useOrganization, useUser } from "@clerk/nextjs";
import { ReactNode } from "react";
import { CreateProjectDialog } from "./form/create-project-dialog";
import { HeaderSkeleton } from "./skeleton/header";
import { Badge } from "@/components/ui/badge";
import { projectStatusStyles } from "../_config/projects";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { ProjectStatus } from "@/convex/projects/models";

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
  <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
  const { membership } = useOrganization();
  const isAdmin = membership?.role === "org:admin";
  const { user } = useUser();

  return (
    <>
      {!user?.firstName ? (
        <HeaderSkeleton />
      ) : (
        <PageHeader
          title={`Welcome back, ${user?.firstName ?? "User"}`}
          subtitle="A quick overview of your projects today"
          action={
            isAdmin && userId && orgId ? (
              <CreateProjectDialog
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