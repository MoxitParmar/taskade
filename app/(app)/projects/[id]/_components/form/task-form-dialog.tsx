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
import { TaskForm } from "./task-form";
import { useOrgMembersData } from "@/app/(app)/dashboard/_hooks/useDashboard";
import { Membership } from "@/convex/memberships/models";


export function TaskDialog({
  orgId,
  userId,
  projectId
}: {
  orgId: Id<"organizations">;
  userId: Id<"users">;
  projectId: Id<"projects">;

}) {
  const [open, setOpen] = React.useState(false);
  const { data} = useOrgMembersData({orgId, userId});
    const memberOptions = React.useMemo(() => {
      return (
        (data?.page ?? [])
          .filter((m: Membership) => m?.user?._id && m?.user?.name)
          .map((m: Membership) => ({
            value: m.user ? m.user._id : "",
            label: m.user ? m.user.name : "",
          }))
      );
    }, [data?.page]);
    
  return (
    <Dialog open={open} onOpenChange={(next) => setOpen(next)}>
      <DialogTrigger asChild>
        <Button variant="default" className="cursor-pointer">
          <Plus />
          New Task
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg p-0">
        <VisuallyHidden>
            <DialogTitle>Create New Task</DialogTitle>
        </VisuallyHidden>
        <TaskForm
          type="create"
          orgId={orgId}
          userId={userId}
          members={memberOptions}
          projectId={projectId}
        />
      </DialogContent>
    </Dialog>
  );
}
