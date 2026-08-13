"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Id } from "@/convex/_generated/dataModel";

import { Membership } from "@/convex/memberships/models";
import { useProjectMembersData } from "@/app/(app)/projects/[id]/_hooks/useProject";
import { TaskForm } from "@/app/(app)/projects/[id]/_components/Forms/TaskForms/task-form";
import { useTaskData } from "../../_hooks/useTask";



export function UpdateTaskDialog({
  orgId,
  userId,
  projectId,
  taskId
}: {
  orgId: Id<"organizations">;
  userId: Id<"users">;
  projectId: Id<"projects">;
  taskId: Id<"tasks">;

}) {
  const [open, setOpen] = React.useState(false);
  const { data} = useProjectMembersData({orgId, projectId});
  const { data: initialData} = useTaskData({orgId, taskId: taskId});
  const memberOptions = React.useMemo(() => {
      return (
        (data ?? [])
          .filter((m: Membership) => m?.user?._id && m?.user?.name)
          .map((m: Membership) => ({
            value: m.user ? m.user._id : "",
            label: m.user ? m.user.name : "",
          }))
      );
    }, [data]);
    
  return (
    <Dialog open={open} onOpenChange={(next) => setOpen(next)}>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          {/* <Plus /> */}
          Update Task
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg p-0">
        <VisuallyHidden>
            <DialogTitle>Update Task</DialogTitle>
        </VisuallyHidden>
        <TaskForm
          type="update"
          orgId={orgId}
          userId={userId}
          members={memberOptions}
          projectId={projectId}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
}
