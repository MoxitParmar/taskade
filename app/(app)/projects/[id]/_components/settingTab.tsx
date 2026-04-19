"use client";

import React from "react";

import { Id } from "@/convex/_generated/dataModel";


import { useDeleteProject, useDeleteProjectMembership, useProjectData, useProjectMembersData } from "../_hooks/useProject";
import { ProjectMemberList } from "@/app/(app)/settings/_components/member-list";
import { UpdateProjectDialog } from "@/app/(app)/dashboard/_components/form/update-project-dialog";
import { BulkDelete } from "@/app/(app)/settings/_components/bulk-delete";
import { DeleteProjectDialog } from "./deleteProjectDialog";

const SettingsTab = ({

  orgId,
    projectId,
  userId,
    membersData,
}: {

  orgId: Id<"organizations">;
  projectId: Id<"projects">;
  userId: Id<"users">;
  membersData: ReturnType<typeof useProjectMembersData>;

}) => {
  const { execute: deleteMembership } = useDeleteProjectMembership();
  const {data: initialData} = useProjectData({orgId, projectId});

  const [selectedMemberIds, setSelectedMemberIds] = React.useState<string[]>(
    [],
  );

  const onDeleteMember = async (id: string) => {
    if (!orgId || !projectId) {
      throw new Error("Organization ID and Project ID are required to delete members.");
    }
    await deleteMembership({ userId: id as Id<"users">, orgId, projectId });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-start">
        <UpdateProjectDialog
              orgId={orgId}
              userId={userId}
              initialData={initialData}
        />

        <BulkDelete
          selectedIds={selectedMemberIds}
          onDeleteItem={onDeleteMember}
          onClearSelection={() => setSelectedMemberIds([])}
          itemLabel="member"
        />
      </div>

      <ProjectMemberList
        membersData={membersData}
        userId={userId}
        selectedMemberIds={selectedMemberIds}
        onSelectionChange={(ids: string[]) =>
          setSelectedMemberIds(
            ids.filter((id) => String(id) !== String(userId)),
          )
        }
      />
      <DeleteProjectDialog projectId={projectId} userId={userId} orgId={orgId} />
    </div>
  );
};

export default SettingsTab;
