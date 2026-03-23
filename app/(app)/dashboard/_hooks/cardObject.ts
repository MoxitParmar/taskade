import { FolderOpen, ListChecks, CheckCircle, AlertTriangle } from "lucide-react";

export  const dashboardCardData = [
  {
    title: "Total Projects",
    value: "0",
    description: "Total number of projects in your account",
    icon: FolderOpen,
    bgColor: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  {
    title: "Active Tasks",
    value: "0",
    description: "Total number of active tasks in all your projects",
    icon: ListChecks,
    bgColor: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    title: "Completed Tasks",
    value: "0",
    description: "Total number of completed tasks in all your projects",
    icon: CheckCircle,
    bgColor: "bg-green-500/10",
    iconColor: "text-green-500",
  },
  {
    title: "Overdue",
    value: "0",
    description: "Total number of overdue tasks in all your projects",
    icon: AlertTriangle,
    bgColor: "bg-red-500/10",
    iconColor: "text-red-500",
  },
];