"use client";

import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Task, TaskPriority, TaskStatus } from "@/convex/tasks/models";
import React from "react";
import TaskTableSkeleton from "./taskTableSkeleton";
import { taskPriorityConfig, taskStatusConfig } from "../../../_config/project-data";
import { useRouter } from 'next/navigation'
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import PaginationControls from "@/components/paginate";
import { getAvatarColor } from "@/app/(app)/settings/_config/avatar-colors";
import { Calendar } from "lucide-react";
import { useProjectTasksData } from "../../../_hooks/useProject";



export function ProjectTaskList({
  status,
  priority,
  assigneeId,
  projectId,
  orgId,
  selectedTaskIds: selectedTasksIdsProp,
  onStatusChange,
  onSelectionChange,
}: {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: Id<"users">;
  orgId: Id<"organizations">;
  projectId: Id<"projects">;
  selectedTaskIds: Id<"tasks">[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onSelectionChange: (ids: Id<"tasks">[]) => void;
}) {
    const tasksData = useProjectTasksData({
      orgId: String(orgId),
      projectId: String(projectId),
      status: status,
      priority: priority,
      assigneeId: assigneeId,
    });
  const { data: tasks, isLoading, page, hasNext, hasPrev, setPage, goPrev, goNext } = tasksData;
  const safeGoPrev = goPrev ?? (() => {});
  const safeGoNext = goNext ?? (() => {});
  const router = useRouter();



  const allSelected = tasks.length > 0 && selectedTasksIdsProp?.length === tasks.length;

  const toggleSelectAll = () => {
    const allIds = tasks.map((m: Task) => m._id);
    if (onSelectionChange) {
      if (allSelected) onSelectionChange([]);
      else onSelectionChange(allIds);
    }
  };

  const toggleSelectOne = (taskId: Id<"tasks">) => {

    if (onSelectionChange) {
      if (selectedTasksIdsProp?.includes(taskId)) {
        onSelectionChange(selectedTasksIdsProp.filter((id) => id !== taskId));
      } else {
        onSelectionChange([...(selectedTasksIdsProp || []), taskId]);
      }
    }
  };


  return (
    <div className="space-y-4">

      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <TaskTableSkeleton />
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 py-16">
            <p className="text-sm text-muted-foreground">No tasks found.</p>
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-10 pl-4">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      aria-pressed={allSelected}
                      className="inline-block cursor-pointer"
                    >
                      <span
                        className={cn(
                          "inline-block size-2.5 rounded-full",
                          allSelected ? "bg-accent-foreground" : "bg-muted-foreground/40",
                        )}
                      />
                    </button>
                  </TableHead>
                 <TableHead className="min-w-50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Title
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Priority
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Assignee
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Due Date
            </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {tasks.map((task: Task) => {
                  const priorityConf = taskPriorityConfig[task.priority];
                  const statusConf = taskStatusConfig[task.status];
                  const initial = task.assignee ? task.assignee?.name.charAt(0).toUpperCase() : "";

                  return (
                   <TableRow
                key={task._id}
                    className="transition-colors duration-150"
                    
              >
                {/* Bullet */}
                <TableCell className="pl-4">
                  <button
                    type="button"
                    onClick={() => toggleSelectOne(task._id)}
                    aria-pressed={selectedTasksIdsProp?.includes(task._id)}
                    className="inline-block cursor-pointer"
                  >
                    <span
                      className={cn(
                        "inline-block size-2.5 rounded-full",
                        selectedTasksIdsProp?.includes(task._id)
                          ? "bg-accent-foreground"
                          : "bg-muted-foreground/30",
                      )}
                    />
                  </button>
                </TableCell>
                <TableCell className="font-medium cursor-pointer" onClick={() => router.push(`/task/${task._id}`)}>{task.name}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-md px-2 py-0.5 text-xs font-semibold ",
                      priorityConf.className,
                    )}
                  >
                    {priorityConf.label}
                  </Badge>
                </TableCell>
                                <TableCell>
                  <Select
                    value={task.status}
                    onValueChange={(value) =>
                      onStatusChange?.(task._id, value as TaskStatus)
                    }
                  >
                    <SelectTrigger className="h-auto w-fit cursor-pointer border-none bg-transparent px-2 py-1 shadow-none focus-visible:ring-0 ">
                      <SelectValue>
                        <span className={cn("text-sm", statusConf.className)}>
                          {statusConf.label}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(taskStatusConfig).map(([key, conf]) => (
                        <SelectItem
                          key={key}
                          value={key}
                          className="cursor-pointer"
                        >
                          <span className={conf.className}>{conf.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar size="sm" className="size-6">
                      <AvatarFallback
                        className={cn(
                          "text-[10px] font-bold",
                          getAvatarColor(task?.assignee?.name || ""),
                        )}
                      >
                        {initial}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{task?.assignee?.name || "Unassigned"}</span>
                  </div>
                </TableCell>

                {/* Due Date */}
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="size-3.5" />
                    <span>{task.dueDate}</span>
                  </div>
                </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

            <PaginationControls
              page={page}
              isFirstPage={!hasPrev}
              hasNextPage={hasNext}
              goPrev={safeGoPrev}
              goNext={safeGoNext}
              syncWithUrl
              urlPageParam="page"
              onPageFromUrl={setPage}
              className="mt-8"
            />
    </div>
  );
}
