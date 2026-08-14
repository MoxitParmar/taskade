import React, { useMemo, useState } from "react";
import {
  format,
  isSameDay,
  isBefore,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CalendarSkeleton from "./calendar-skeleton";
import { useProjectTasksData } from "../../../_hooks/useProject";

type Task = {
  _id: string;
  name: string;
  createdAt?: string | number | null;
  dueDate?: string | Date | null;
  description?: string;
  priority?: "low" | "medium" | "high" | string;
  status?: string;
  assignee?: { _id?: string; name?: string; email?: string; imageUrl?: string } | null;
  project?: any;
};

interface Props {
  tasks: Task[];
  isLoading: boolean;
}

const typeColors: Record<string, string> = {
  BUG: "bg-destructive/20 text-destructive-foreground",
  FEATURE: "bg-primary/20 text-primary-foreground",
  TASK: "bg-accent/20 text-accent-foreground",
  IMPROVEMENT: "bg-secondary/20 text-secondary-foreground",
  OTHER: "bg-muted/20 text-muted-foreground",
};

const priorityBorders: Record<string, string> = {
  LOW: "border-muted",
  MEDIUM: "border-accent",
  HIGH: "border-destructive",
};

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export function CalendarTab({ orgId, projectId }: { orgId: string; projectId: string }) {
    const taskData = useProjectTasksData({
    orgId: String(orgId),
    projectId: String(projectId),
  });
  const isLoading = taskData?.isLoading;
  const tasks: Task[] = taskData?.data || [];

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const today = new Date();

  const getTasksForDate = (date: Date) =>
    tasks.filter(
      (task) =>
        task.dueDate &&
        isSameDay(new Date(task.dueDate as string | Date), date)
    );

  const overdueTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          task.dueDate &&
          isBefore(new Date(task.dueDate as string | Date), today) &&
          task.status?.toLowerCase() !== "done"
      ),
    [tasks, today]
  );

  const daysInMonth = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });

  const handleMonthChange = (direction: "next" | "prev") => {
    setCurrentMonth((prev) => (direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1)));
  };

  if (isLoading) {
    return <CalendarSkeleton />;
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="p-4">
          <CardHeader className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon className="w-4 h-4" />
              <CardTitle className="m-0 text-base">Task Calendar</CardTitle>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleMonthChange("prev")} aria-label="Previous month">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-sm">{format(currentMonth, "MMMM yyyy")}</div>
              <Button variant="ghost" size="sm" onClick={() => handleMonthChange("next")} aria-label="Next month">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="grid grid-cols-7 text-xs text-muted-foreground mb-2 text-center">
              {weekdays.map((w) => (
                <div key={w}>{w}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {daysInMonth.map((day) => {
                const dayTasks = getTasksForDate(day);
                const isSelected = isSameDay(day, selectedDate);
                const hasOverdue = dayTasks.some(
                  (t) =>
                    t.status?.toLowerCase() !== "done" &&
                    t.dueDate &&
                    isBefore(new Date(t.dueDate as string | Date), today)
                );

                return (
                  <button
                    key={format(day, "yyyy-MM-dd")}
                    onClick={() => setSelectedDate(day)}
                    aria-pressed={isSelected}
                    className={`sm:h-14 rounded-md flex flex-col items-center justify-center text-sm w-full
                      ${isSelected ? "bg-primary/70 text-primary-foreground" : "bg-transparent text-foreground hover:bg-muted/5 dark:hover:bg-muted/20"}
                      ${hasOverdue ? "border border-destructive/50" : ""}`}
                  >
                    <span>{format(day, "d")}</span>
                    {dayTasks.length > 0 && (
                      <Badge className="text-[10px] mt-1 rounded-full bg-accent/60 text-accent-foreground" variant="outline">
                        {dayTasks.length}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected day tasks */}

      </div>

      {/* Sidebar */}
      <div className="space-y-6">
                {overdueTasks.length > 0 && (
          <Card className="p-4 border-destructive">
            <CardTitle className="text-sm text-destructive flex items-center gap-2">Overdue Tasks ({overdueTasks.length})</CardTitle>
            <CardContent className="p-0 mt-2">
              <div className="space-y-2">
                {overdueTasks.slice(0, 5).map((task) => (
                  <div key={task._id} className="p-3 rounded-lg bg-destructive/10 dark:bg-destructive/20 hover:bg-destructive/20 dark:hover:bg-destructive/30 transition">
                    <div className="flex justify-between text-sm text-foreground">
                      <span>{task.name}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground items-center py-1">
                    <p className="text-xs ">Due {task.dueDate ? format(new Date(task.dueDate as string | Date), "MMM d") : ""}</p>
                    {task.assignee ? (
                      <div className="flex items-center gap-2">

                        <span className="text-xs">{task.assignee.name}</span>
                      </div>
                    ) : null}
                  </div>
                  </div>
                ))}
                {overdueTasks.length > 5 && <div className="text-xs text-muted-foreground text-center">+{overdueTasks.length - 5} more</div>}
              </div>
            </CardContent>
          </Card>
        )}
                {getTasksForDate(selectedDate).length > 0 && (
          <Card className=" p-4">
            <CardTitle className="text-base ">Tasks for {format(selectedDate, "MMM d, yyyy")}</CardTitle>
            <div >
              {getTasksForDate(selectedDate).map((task) => (
                <div
                  key={task._id}
                  className={`bg-transparent hover:bg-muted/5 dark:hover:bg-muted/20 transition p-4 rounded  ${
                    priorityBorders[(task.priority || "").toUpperCase()] ?? ""
                  }`}>

                  <div className="flex justify-between py-1">
                    <div className="font-medium text-foreground">{task.name}</div>
                  </div>

                  <div className="flex justify-between text-xs text-muted-foreground items-center">
                    <span className="capitalize">{(task.priority || "").toLowerCase()} priority</span>
                    {task.assignee ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{task.assignee.name}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}


      </div>
    </div>
  );
};

export default CalendarTab;
