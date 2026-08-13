import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { Id } from "@/convex/_generated/dataModel";
import { useProjectCardData } from "../_hooks/useProject";
import { projectCardStats } from "../_config/project-data";
import { DashboardCardsSkeleton } from "@/app/(app)/dashboard/_components/skeleton/dashboardCard";

export function ProjectCards({
  orgId,
  projectId,
}: {
  orgId: Id<"organizations">;
  projectId: Id<"projects">;
}) {
  const { data, isLoading } = useProjectCardData({ orgId, projectId });
  const totalTasks = data?.projectTasks ?? 0;
  const completed = data?.completedTasks ?? 0;
  const inProgress = data?.activeTasks ?? 0;
  const teamMembers = data?.projectMembers ?? 0;
  const values = [totalTasks, completed, inProgress, teamMembers];

  return (
    <div className="grid grid-cols-2 gap-4 my-8 lg:grid-cols-4">
      {isLoading ? (
        <DashboardCardsSkeleton />
      ) : (
        <>
          {projectCardStats.map((stat, index) => (
            <Card
              key={stat.title}
              className="gap-2 cursor-pointer transition-colors duration-200 hover:border-accent-foreground/40"
            >
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <CardAction>
                  <stat.icon className={cn("size-4", stat.iconColor)} />
                </CardAction>
              </CardHeader>
              <CardContent className="pt-0">
                <div
                  className={cn(
                    "text-3xl font-bold tracking-tight",
                    stat.valueColor,
                  )}
                >
                  {values[index]}
                </div>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}
