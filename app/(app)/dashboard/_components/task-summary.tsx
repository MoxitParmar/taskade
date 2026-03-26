"use client"
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type TaskSummaryConfig,  mapUserTasksToSummary } from "../_config/task-summary";
import { useRouter } from 'next/navigation'

import { Skeleton } from "@/components/ui/skeleton";
import { useUserTasksData } from "../_hooks/useDashboard";
import { TaskPriority } from "@/convex/tasks/models";

const MAX_VISIBLE = 3;

const priorityColor: Record<TaskPriority, string> = {
  HIGH: "text-accent-foreground",
  MEDIUM: "text-muted-foreground",
  LOW: "text-muted-foreground/70",
};

export function TaskSummaryCard({ config }: { config: TaskSummaryConfig }) {
  const totalCount = config.items.length;
  const visibleItems = config.items.slice(0, MAX_VISIBLE);
    const remaining = totalCount - MAX_VISIBLE;
    const router = useRouter();

    return (
      
    <Card className="gap-0 py-0 overflow-hidden cursor-pointer transition-colors duration-200 hover:border-accent-foreground/40">
      {/* Header */}
      <CardHeader className="py-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-9 items-center justify-center rounded-lg",
              config.iconBg,
            )}
          >
            <config.icon className="size-4 text-muted-foreground" />
          </div>
          <CardTitle className="text-base font-semibold">
            {config.title}
          </CardTitle>
        </div>
        <CardAction>
          <span
            className={cn(
              "inline-flex size-6 items-center justify-center rounded-md text-xs font-bold",
              config.badgeBg,
              config.badgeText,
            )}
          >
            {totalCount}
          </span>
        </CardAction>
      </CardHeader>

      {/* Items */}
      <CardContent className="px-4 pb-0" >
        {visibleItems.map((item, i) => (
          <div
            key={`${item.title}-${i}`}
                className="border-t border-border px-2 py-3.5 mx-2  transition-colors duration-150 hover:bg-accent/50 cursor-pointer"
                onClick={() => {router.push(`task/${item._id}`)}}
          >
            <h4 className="text-sm font-semibold">{item.title}</h4>
            <p className="mt-0.5 text-xs text-muted-foreground">
              <span className={priorityColor[item.priority]}>
                {item.priority} Priority
              </span>
              <span className="mx-1.5">•</span>
              Due: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "No due date"}
            </p>
          </div>
        ))}
      </CardContent>

      {/* View more footer */}
      {remaining > 0 && (
        <CardFooter className="justify-center border-t border-border py-3">
          <Link
            href="#"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View {remaining} more
            <ArrowRight className="size-4" />
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}



export default function TaskSummary({userId, orgId}: {userId: string, orgId: string}) {
    const { data, isLoading } = useUserTasksData({userId, orgId}); 
    const taskSummaryData = mapUserTasksToSummary(data?.page);   
  return (
    <div>
      
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
  );
}
