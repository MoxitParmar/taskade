import { Id } from "@/convex/_generated/dataModel";
import {  MessageSquare,  CheckCircle } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ActivityType = "task" | "comment" ;
export type ActivityStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface ActivityItem {
  id: Id<"tasks">;
  entityId: Id<"tasks">;
  entityType: ActivityType;
  type: string;
  status: ActivityStatus;
  metadata: {
    name: string;
    assigneeName: string;
    priority: string;
    status: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
  };
  createdAt: number;
  updatedAt: number;
}

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

