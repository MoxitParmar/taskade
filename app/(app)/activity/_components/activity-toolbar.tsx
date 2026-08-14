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
import { options } from "../../projects/_components/form/ProjectForm/project-form";



interface TaskToolbarProps {
  type: string;
  onTypeChange: (value: string) => void;
  assignee: string;
  onAssigneeChange: (value: string) => void;
  assigneeOptions: options[];
  onReset: () => void;
}

export default function TaskToolbar({
  type,
  onTypeChange,
  assignee,
  onAssigneeChange,
  assigneeOptions,
  onReset,
}: TaskToolbarProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const filtersActive = type !== "" || assignee !== "";

  return (
    <div className="flex flex-col gap-3 sm:w-fit sm:flex-row sm:items-center">
      {isMounted ? (
        <>
          <Select value={type} onValueChange={onTypeChange}>
            <SelectTrigger className="w-full cursor-pointer sm:w-fit">
              <SelectValue placeholder="Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="comment">Comment</SelectItem>
              <SelectItem value="task">Task</SelectItem>
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
          Types
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
