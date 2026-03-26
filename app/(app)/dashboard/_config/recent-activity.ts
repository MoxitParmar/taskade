import { ActivityType, ActivityStatus } from "@/convex/activityLogs/models";
import {  MessageSquare,  CheckCircle } from "lucide-react";


// ─── Type icon config ────────────────────────────────────────────────────────

export const activityTypeConfig: Record<
  ActivityType,
  { icon: React.ElementType; iconColor: string; bgColor?: string }
> = {
  task: {
    icon: CheckCircle,
    iconColor: "text-emerald-400",
    // bgColor: "bg-emerald-500/15",
  },
  comment: {
    icon: MessageSquare,
    iconColor: "text-amber-400",
    // bgColor: "bg-amber-500/15",
  }
};

// ─── Status badge config ─────────────────────────────────────────────────────

export const activityStatusConfig: Record<
  ActivityStatus,
  { label: string; badgeClass: string }
> = {
  TODO: {
    label: "TODO",
    badgeClass: "bg-blue-500/15 text-blue-400",
  },
  IN_PROGRESS: {
    label: "IN PROGRESS",
    badgeClass: "bg-amber-400/20 text-amber-400 ",
  },
  DONE: {
    label: "DONE",
    badgeClass: "bg-emerald-500/15 text-emerald-500",
  },
};

