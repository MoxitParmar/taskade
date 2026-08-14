import { BadgeStyles } from "@/app/(app)/dashboard/_config/projects";
import { ProjectStatus } from "@/convex/projects/models";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { TaskPriority } from "@/convex/tasks/models";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
    action?: ReactNode;
    badge?: ProjectStatus | TaskPriority;
    back?: boolean;
};

export function PageHeader({ title, subtitle, action, badge, back }: PageHeaderProps) {
  
  const config = badge ? BadgeStyles[badge] : undefined;

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
