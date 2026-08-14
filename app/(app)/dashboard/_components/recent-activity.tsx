import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";

import {
  activityTypeConfig,
  activityStatusConfig,
} from "../_config/recent-activity";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserActivityData } from "../_hooks/useDashboard";
import { ActivityLogs } from "@/convex/activityLogs/models";

function ActivityRow({ item }: { item: ActivityLogs }) {
  const typeConfig = activityTypeConfig[item.entityType];
  const statusConfig = activityStatusConfig[ item.status ?? "TODO" ];
  const router = useRouter();
  const Icon = typeConfig?.icon; 

  return (
    <div
      className="border-t border-border cursor-pointer px-4 py-4 sm:px-6 sm:py-5 transition-colors duration-150 hover:bg-accent/50 "
onClick={() => {
  // item is an ActivityLogs doc — its _id is an activityLogs ID, not a task ID.
  // Navigate to the task the activity refers to instead.
  const taskId =
    item.entityType === "task"
      ? item.entityId
      : item.entityDetails?.taskId;
  if (taskId) router.push(`/task/${taskId}`);
}}
    >
      <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4">
        {/* Left: Icon + Info */}
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
          {/* Type Icon */}
          <div
            className={cn(
              "flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-lg mt-0.5 sm:mt-0",
              typeConfig?.bgColor,
            )}
          >
            <Icon
              className={cn("size-4", typeConfig?.iconColor)}
              strokeWidth={2}
            />
          </div>

          {/* Title + Meta */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2 sm:justify-start">
              <h4 className="text-sm font-semibold truncate">{item?.metadata?.name ?? item?.metadata?.content}</h4>
              {/* Badge visible only on small screens, inline with title */}
              <span
                className={cn(
                  "shrink-0 rounded-md px-2.5 py-0.5 text-[10px] sm:hidden font-bold tracking-wide",
                  statusConfig?.badgeClass,
                )}
              >
                {statusConfig?.label}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="hidden xs:inline sm:inline">
                  {/* {item?.metadata?.assigneeName ?? item?.user?.name} */}
                  { item?.entityType == "comment" ? `from: ${item?.user?.name} | task: ${item?.metadata?.taskName}` : `from: ${item?.user?.name} to: ${item?.metadata?.assigneeName}` }
                </span>
              </span>
              <span>{formatDate(item?.createdAt ?? 0)}</span>
            </div>
          </div>
        </div>

        {/* Right: Status Badge — hidden on small screens, shown on sm+ */}
        <span
          className={cn(
            "hidden sm:inline-flex shrink-0 rounded-md px-3 py-1 text-xs font-bold tracking-wide",
            statusConfig?.badgeClass,
          )}
        >
          {statusConfig?.label}
        </span>
      </div>
    </div>
  );
}

export function RecentActivity({orgId, userId}: {orgId: string, userId: string}) {

    const {data, isLoading} = useUserActivityData({orgId, userId});
    console.log("RecentActivity data:", data);
  return (
    <>
      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : (
        <Card className="gap-0 py-0 overflow-hidden  transition-colors duration-200 hover:border-accent-foreground/40">
          <CardHeader className="py-4">
            <CardTitle className="text-base font-semibold">
              Recent Activity
            </CardTitle>
            <CardAction>
              <Link
                href="/activity"
                className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                View all
                <ArrowRight className="size-4" />
              </Link>
            </CardAction>
          </CardHeader>

          <CardContent className="px-0 pb-0">
            {data?.page?.length ? (
              data.page.slice(0, 7).map((item: ActivityLogs) => (
                <ActivityRow key={`${item._id}`} item={item} />
              ))
            ) : (
              <div className="border-t border-border flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
                <p className="text-sm font-medium text-foreground">
                  No recent activity
                </p>
                <p className="text-xs text-muted-foreground">
                  Your activity will show up here as you get things done.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
