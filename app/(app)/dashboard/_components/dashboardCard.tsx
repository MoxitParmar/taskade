import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DashboardCardsSkeleton } from "./skeleton/dashboardCard";
import { useDashboardCardData } from "../_hooks/useDashboard";
import { dashboardCardData } from "../_config/cardObject";

interface DashboardCardItem {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  iconColor?: string;
  bgColor?: string;
}

export function DashboardCard({userId, orgId}: {userId: string, orgId: string}) {
  const { data, isLoading } = useDashboardCardData({userId, orgId});
  const CardData = dashboardCardData?.map((card) => {
    if (card.title === "Total Projects") {
      return {
        ...card,
        value: data?.usersProjects,
      };
    } else if (card.title === "Active Tasks") {
      return {
        ...card,
        value: data?.ActiveTasks,
      };
    } else if (card.title === "Completed Tasks") {
      return {
        ...card,
        value: data?.CompletedTasks,
      };
    } else if (card.title === "Overdue") {
      return {
        ...card,
        value: data?.OverdueTasks,
      };
    } else {
      return card;
    }
  });
  return (
    <>
      {isLoading ? (
        <DashboardCardsSkeleton />
      ) : (
        CardData.map((item: DashboardCardItem) => (
          <Card
            key={item.title}
            className="gap-3 transition-colors duration-200 hover:border-accent-foreground/40"
          >
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <CardAction>
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg",
                    item.bgColor,
                  )}
                >
                  <item.icon
                    className={cn("size-4", item.iconColor)}
                    strokeWidth={2}
                  />
                </div>
              </CardAction>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold tracking-tight">
                {item.value}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </>
  );
}
