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

import { options, ProjectForm } from "./project-form";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Id } from "@/convex/_generated/dataModel";

export function ProjectDialog({
  orgId,
  userId,
  members,
}: {
  orgId: Id<"organizations">;
  userId: Id<"users">;
  members: options[];
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={(next) => setOpen(next)}>
      <DialogTrigger asChild>
        <Button variant="default" className="cursor-pointer">
          <Plus />
          New Project
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg p-0">
        <VisuallyHidden>
            <DialogTitle>Create New Project</DialogTitle>
        </VisuallyHidden>
        <ProjectForm
          type="create"
          orgId={orgId}
          userId={userId}
          members={members}
        />
      </DialogContent>
    </Dialog>
  );
}
