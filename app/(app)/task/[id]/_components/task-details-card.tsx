"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Task } from "@/convex/tasks/models";
import { taskPriorityConfig } from "@/app/(app)/projects/[id]/_config/project-data";
// import { NewTaskDialog } from "./dialogs/new-task-dialog";
// import { DeleteTaskDialog } from "./dialogs/delete-task-dialog";

export function TaskDetailsCard({
  task,
  isLoading,
}: {
  task: Task | null;
  isLoading: boolean;
}) {
  const priorityConf = task ? taskPriorityConfig[task.priority] : undefined;

  return (
    <div className="space-y-6">
      {/* Task Details */}
      <Card
        className={cn(
          "p-4 pb-1 border gap-2",
          task?.isOverdue && "border-destructive/50"
        )}
      >
        <div className="flex gap-1">
          <CardTitle className="text-base">Task Details</CardTitle>
          {task?.isOverdue && (
            <Badge
              variant="outline"
              className="rounded-md px-2.5 py-0.5 text-xs font-semibold bg-red-500/15 text-red-400 border-red-500/30 scale-80"
            >
              Overdue
            </Badge>
          )}
        </div>

        {isLoading ? (
          <CardContent className="p-4">Loading task...</CardContent>
        ) : task ? (
          <div className="border-t-2">
            <div className="bg-transparent hover:bg-muted/5 dark:hover:bg-muted/20 transition p-2 rounded">
              <div className="flex justify-between">
                <div className="text-lg mb-4 text-foreground">{task.name}</div>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-md px-2 py-0.5 text-xs font-semibold",
                    priorityConf?.className
                  )}
                >
                  {priorityConf?.label}
                </Badge>
              </div>

              <div className="flex justify-between text-sm text-muted-foreground items-center">
                <span className="capitalize">
                  due:{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "No due date"}
                </span>
                {task.assignee ? (
                  <div className="flex items-center gap-1">
                    <Avatar className="scale-70">
                      {task.assignee.imageUrl ? (
                        <AvatarImage
                          src={task.assignee.imageUrl}
                          alt={task.assignee.name}
                        />
                      ) : (
                        <AvatarFallback>
                          {task.assignee.name?.[0] || "?"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="text-sm">{task.assignee.name}</span>
                  </div>
                ) : (
                  <span>Unassigned</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <CardContent className="p-4">Task not available</CardContent>
        )}
      </Card>

      {/* Project Details */}
      <Card className="p-4 pb-1 border gap-2">
        <CardTitle className="text-base">Project Details</CardTitle>

        {isLoading ? (
          <CardContent className="p-4">Loading Project...</CardContent>
        ) : task?.project ? (
          <div className="border-t-2">
            <div className="bg-transparent hover:bg-muted/5 dark:hover:bg-muted/20 transition p-2 rounded">
              <div className="flex justify-between">
                <div className="text-lg mb-4 text-foreground">
                  {task.project.name}
                </div>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground items-center">
                <span className="capitalize">
                  createdAt:{" "}
                  {task.project.createdAt
                    ? new Date(task.project.createdAt).toLocaleDateString()
                    : "No due date"}
                </span>
                {task.project.lead ? (
                  <div className="flex items-center gap-1">
                    <Avatar className="scale-70">
                      {task.project.lead.imageUrl ? (
                        <AvatarImage
                          src={task.project.lead.imageUrl}
                          alt={task.project.lead.name}
                        />
                      ) : (
                        <AvatarFallback>
                          {task.project.lead.name || "?"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="text-sm">{task.project.lead.name}</span>
                  </div>
                ) : (
                  <span>Unassigned</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <CardContent className="p-4">Task not available</CardContent>
        )}
      </Card>

      {/* Actions */}
      {/* <div className="flex justify-between">
        <div className="flex gap-2">
          <UpdateTaskDialog
            projectId={task?.project._id}
            taskId={task?._id}
          />
          <DeleteTaskDialog taskId={task?._id} />
        </div>
      </div> */}
    </div>
  );
}