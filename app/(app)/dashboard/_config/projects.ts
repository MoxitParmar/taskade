import { ProjectStatus } from "@/convex/projects/models";
import { TaskPriority } from "@/convex/tasks/models";

// ---------------------------------------------------------------------------
// Centralized style configs — used by project-card, detail-header, overview
// ---------------------------------------------------------------------------

export const BadgeStyles: Record<
  ProjectStatus | TaskPriority,
  {
    label: string;
    badgeClass: string;
    dotClass: string;
    progressBarClass: string;
  }
> = {
  "planning": {
    label: "PLANNING",
    badgeClass: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    dotClass: "bg-violet-400",
    progressBarClass: "[&>[data-slot=progress-indicator]]:bg-blue-500",
  },
  "active": {
    label: "ACTIVE",
    badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    dotClass: "bg-amber-400",
    progressBarClass: "[&>[data-slot=progress-indicator]]:bg-emerald-500",
  },
  "on-hold": {
    label: "ON HOLD",
    badgeClass: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    dotClass: "bg-yellow-400",
    progressBarClass: "[&>[data-slot=progress-indicator]]:bg-amber-500",
  },
  "completed": {
    label: "COMPLETED",
    badgeClass: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    dotClass: "bg-blue-400",
    progressBarClass: "[&>[data-slot=progress-indicator]]:bg-cyan-500",
  },
  "low": {
    label: "LOW",
    badgeClass: "bg-green-500/20 text-green-400 border-green-500/30",
    dotClass: "bg-green-400",
    progressBarClass: "[&>[data-slot=progress-indicator]]:bg-green-500",
  },
  "medium": {
    label: "MEDIUM",
    badgeClass: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    dotClass: "bg-yellow-400",
    progressBarClass: "[&>[data-slot=progress-indicator]]:bg-yellow-500",
  },
  "high": {
    label: "HIGH",
    badgeClass: "bg-red-500/20 text-red-400 border-red-500/30",
    dotClass: "bg-red-400",
    progressBarClass: "[&>[data-slot=progress-indicator]]:bg-red-500",
  },
};