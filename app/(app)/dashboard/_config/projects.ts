import { ProjectStatus } from "@/convex/projects/models";

// ---------------------------------------------------------------------------
// Centralized style configs — used by project-card, detail-header, overview
// ---------------------------------------------------------------------------

export const projectStatusStyles: Record<
  ProjectStatus,
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
};