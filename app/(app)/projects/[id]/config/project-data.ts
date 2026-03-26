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