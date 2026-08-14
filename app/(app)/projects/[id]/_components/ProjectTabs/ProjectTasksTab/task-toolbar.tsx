"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
} from "@/components/ui/select";
import { options } from "@/app/(app)/projects/_components/form/ProjectForm/project-form";



interface TaskToolbarProps {
  status: string;
  onStatusChange: (value: string) => void;

  priority: string;
  onPriorityChange: (value: string) => void;
  assignee: string;
  onAssigneeChange: (value: string) => void;
  assigneeOptions: options[];
  onReset: () => void;
}

export default function TaskToolbar({
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  assignee,
  onAssigneeChange,
  assigneeOptions,
  onReset,
}: TaskToolbarProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const filtersActive = priority !== "" || status !== "" || assignee !== "";

  return (
    <div className="flex flex-col gap-3 sm:w-fit sm:flex-row sm:items-center">
      {isMounted ? (
        <>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full cursor-pointer sm:w-fit">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">Todo</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priority} onValueChange={onPriorityChange}>
            <SelectTrigger className="w-full cursor-pointer sm:w-fit">
              <SelectValue placeholder="All Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>

          <Select value={assignee} onValueChange={onAssigneeChange}>
            <SelectTrigger className="w-full cursor-pointer sm:w-fit">
              <SelectValue placeholder="All Assignees" />
            </SelectTrigger>
            <SelectContent>
              {assigneeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      ) : (
        <>
        <div className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-muted-foreground sm:w-fit">
          All Status
        </div>
        <div className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-muted-foreground sm:w-fit">
          All Priority
        </div>
        <div className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-muted-foreground sm:w-fit">
          All Assignees
        </div>
        </>
      )}

      {filtersActive && (
        <Button variant="outline" onClick={onReset} className="ml-2">
          Clear
        </Button>
      )}
    </div>
  );
}
