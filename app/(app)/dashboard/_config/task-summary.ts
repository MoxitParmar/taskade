import { Id } from "@/convex/_generated/dataModel";
import { Task, TaskPriority } from "@/convex/tasks/models";
import { Users, AlertTriangle, Clock } from "lucide-react";


export interface TaskSummaryItem {
  title: string;
    priority: TaskPriority;
    dueDate: number | undefined;
    _id: Id<"tasks">;
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
  const p = priority?.toLowerCase();
  if (p === "high" || p === "medium" || p === "low") return p;
  return "low";
}



export function mapUserTasksToSummary(userTasks: Task[]  | undefined) {
  const tasks = userTasks ?? [];

  const myTasks: TaskSummaryItem[] = tasks
    .filter((t) => t?.status !== "done")
    .map((t) => ({
      title: t?.name,
      dueDate: t?.dueDate,
      _id:  t?._id,
      priority: mapPriority(t?.priority),
    }));

  const overdueTasks: TaskSummaryItem[] = tasks
    .filter((t) => t?.dueDate ? Date.now() > t?.dueDate : false && t?.status !== "done")
    .map((t) => ({
      title: t?.name,
      dueDate: t?.dueDate,
      _id:  t?._id,
      priority: mapPriority(t?.priority),
    }));

  const inProgressTasks: TaskSummaryItem[] = tasks
    .filter((t) => t?.status === "in-progress")
    .map((t) => ({
      title: t?.name,
      dueDate: t?.dueDate,
      _id:  t?._id,
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
