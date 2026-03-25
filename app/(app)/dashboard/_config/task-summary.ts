import { Id } from "@/convex/_generated/dataModel";
import { Task } from "@/convex/tasks/models";
import { Users, AlertTriangle, Clock } from "lucide-react";
// import { Duplex } from "stream";

export type TaskPriority = "HIGH" | "MEDIUM" | "LOW";
export type TaskType = "TASK" | "FEATURE" | "IMPROVEMENT" | "OTHER";

export interface TaskSummaryItem {
  title: string;
  type: TaskType;
    priority: TaskPriority;
    dueDate: string | number | Date;
    id: Id<"tasks">;
}

export interface TaskSummaryConfig {
  title: string;
  icon: React.ElementType;
  iconBg: string;
  badgeBg: string;
  badgeText: string;
  items: TaskSummaryItem[];
}

// Map server-side tasks pagination result -> TaskSummaryConfig-like structure
function mapPriority(priority: string | undefined): TaskPriority {
  const p = priority?.toUpperCase();
  if (p === "HIGH" || p === "MEDIUM" || p === "LOW") return p;
  return "LOW";
}

function mapType(status: string | undefined): TaskType {
  if (status === "feature") return "FEATURE";
  if (status === "improvement") return "IMPROVEMENT";
  return "TASK";
}


export function mapUserTasksToSummary(userTasks: Task[]  | undefined) {
  const tasks = userTasks ?? [];

  const myTasks: TaskSummaryItem[] = tasks
    .filter((t) => t?.status !== "done")
    .map((t) => ({
      title: t?.name,
      dueDate: t?.dueDate,
      type: mapType( t?.status),
      id:  t?._id,
      priority: mapPriority(t?.priority),
    }));

  const overdueTasks: TaskSummaryItem[] = tasks
    .filter((t) => t?.dueDate ? Date.now() > t?.dueDate : false && t?.status !== "done")
    .map((t) => ({
      title: t?.name,
      dueDate: t?.dueDate,
      type: mapType( t?.status),
      id:  t?._id,
      priority: mapPriority(t?.priority),
    }));

  const inProgressTasks: TaskSummaryItem[] = tasks
    .filter((t) => t?.status === "in-progress")
    .map((t) => ({
      title: t?.name,
      dueDate: t?.dueDate,
      id:  t?._id,
      type: mapType( t?.status),
      priority: mapPriority(t?.priority),
    }));

  const taskSummaryData = [
    {
      title: "My Tasks",
      // server-side: use icon name; the client can map this to a component
      icon: Users,
      iconBg: "bg-muted",
      badgeBg: "bg-emerald-500/15",
      badgeText: "text-emerald-500",
      items: myTasks,
    },
    {
      title: "Overdue",
      icon: AlertTriangle,
      iconBg: "bg-muted",
      badgeBg: "bg-red-500/15",
      badgeText: "text-red-500",
      items: overdueTasks,
    },
    {
      title: "In Progress",
      icon: Clock,
      iconBg: "bg-muted",
      badgeBg: "bg-blue-500/15",
      badgeText: "text-blue-500",
      items: inProgressTasks,
    },
  ];

  return taskSummaryData;
}
