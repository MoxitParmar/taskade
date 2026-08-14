"use client";

import * as React from "react";
import { Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { AddMemberForm } from "./add-member-form";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Id } from "@/convex/_generated/dataModel";

import { Membership } from "@/convex/memberships/models";
import { useProjectMembersData } from "@/app/(app)/projects/[id]/_hooks/useProject";
import { useOrgMembersData } from "@/app/(app)/dashboard/_hooks/useDashboard";

export function AddProjectMemberDialog({
  projectId,
  orgId,
  userId,
}: {
  projectId: Id<"projects">;
  orgId: Id<"organizations">;
  userId: Id<"users">;
}) {
  const [open, setOpen] = React.useState(false);
  const { data: orgMembersData } = useOrgMembersData({ orgId, userId });
  const { data: projectMembersData } = useProjectMembersData({ orgId, projectId });

  const memberOptions = React.useMemo(() => {
    const existingMemberIds = new Set(
      (projectMembersData ?? [])
        .filter((m: Membership) => m?.user?._id)
        .map((m: Membership) => m.user!._id),
    );

    return (
      (orgMembersData?.page ?? [])
        .filter(
          (m: Membership) =>
            m?.user?._id &&
            m?.user?.name &&
            !existingMemberIds.has(m.user._id),
        )
        .map((m: Membership) => ({
          value: m.user ? m.user._id : "",
          label: m.user ? m.user.name : "",
        }))
    );
  }, [orgMembersData?.page, projectMembersData]);

  return (
    <Dialog open={open} onOpenChange={(next) => setOpen(next)}>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          <Users className="mr-2 h-4 w-4" />
          Add members
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg p-0">
        <VisuallyHidden>
          <DialogTitle>Add project members</DialogTitle>
        </VisuallyHidden>
        <AddMemberForm
          projectId={projectId}
          members={memberOptions}
            orgId={orgId}
        />
      </DialogContent>
    </Dialog>
  );
}