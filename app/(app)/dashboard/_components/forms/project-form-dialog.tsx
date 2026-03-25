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

import {  ProjectForm } from "./project-form";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Id } from "@/convex/_generated/dataModel";
import { useOrgMembersData } from "../../_hooks/useDashboard";

export function ProjectDialog({
  orgId,
  userId,
}: {
  orgId: Id<"organizations">;
  userId: Id<"users">;
}) {
  const [open, setOpen] = React.useState(false);
  const { data} = useOrgMembersData({orgId, userId});
    const memberOptions = React.useMemo(() => {
      return (
        (data?.page ?? [])
          //eslint-disable-next-line
          .filter((m: any) => m?.user?.id && m?.user?.name)
          //eslint-disable-next-line
          .map((m: any) => ({
            value: m.user.id,
            label: m.user.name,
          }))
      );
    }, [data?.page]);
    
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
          members={memberOptions}
        />
      </DialogContent>
    </Dialog>
  );
}
