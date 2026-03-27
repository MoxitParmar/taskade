import { TaskPriority, TaskStatus } from "@/convex/tasks/models";
import { LucideIcon, Zap, CheckCircle, Clock, Users } from "lucide-react";

export interface ProjectCardStat {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  valueColor: string;
}

export const projectCardStats: ProjectCardStat[] = [
  {
    title: "Total Tasks",
    icon: Zap,
    iconColor: "text-amber-400",
    valueColor: "text-foreground",
  },
  {
    title: "Completed",
    icon: CheckCircle,
    iconColor: "text-emerald-400",
    valueColor: "text-emerald-400",
  },
  {
    title: "In Progress",
    icon: Clock,
    iconColor: "text-cyan-400",
    valueColor: "text-cyan-400",
  },
  {
    title: "Team Members",
    icon: Users,
    iconColor: "text-blue-400",
    valueColor: "text-blue-400",
  },
];

// ---------------------------------------------------------------------------
// Task status config
// ---------------------------------------------------------------------------

export const taskStatusConfig: Record<
  TaskStatus,
  { label: string; className: string }
> = {
  todo: {
    label: "To Do",
    className: "text-muted-foreground",
  },
  "in-progress": {
    label: "In Progress",
    className: "text-blue-400",
  },
  done: {
    label: "Done",
    className: "text-emerald-400",
  },
};



// ---------------------------------------------------------------------------
// Task priority config
// ---------------------------------------------------------------------------

export const taskPriorityConfig: Record<
  TaskPriority,
  { label: string; className: string }
> = {
  low: {
    label: "LOW",
    className: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  },
  medium: {
    label: "MEDIUM",
    className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  high: {
    label: "HIGH",
    className: "bg-red-500/15 text-red-400 border-red-500/30",
  }
};