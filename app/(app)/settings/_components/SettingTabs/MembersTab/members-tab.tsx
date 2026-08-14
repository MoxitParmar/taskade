"use client";

import React from "react";

import { Id } from "@/convex/_generated/dataModel";
import { BulkDelete } from "../../../../../../components/bulk-delete";
import { useDeleteMembership, useOrgMembersData } from "../../../_hooks/useSettings";
import { UpdateOrganizationForm } from "./updateOrgForm";
import { ProjectMemberList } from "./member-list";

const Members = ({
  organization,
  orgId,
  userId,
}: {
  organization: any;
  orgId: Id<"organizations">;
  userId: Id<"users">;
}) => {
    const membersData = useOrgMembersData({ orgId: String(orgId) });

  const { execute: deleteMembership } = useDeleteMembership();

  const [selectedMemberIds, setSelectedMemberIds] = React.useState<string[]>(
    [],
  );

  const onDeleteMember = async (id: string) => {
    if (!orgId) {
      throw new Error("Organization ID is required to delete members.");
    }
    await deleteMembership({ userId: id as Id<"users">, orgId });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-start">
        <UpdateOrganizationForm organization={organization} />
        <BulkDelete
          selectedIds={selectedMemberIds}
          onDeleteItem={onDeleteMember}
          onClearSelection={() => setSelectedMemberIds([])}
          itemLabel="member"
        />
      </div>

      <ProjectMemberList
        userId={userId}
        membersData={membersData}
        selectedMemberIds={selectedMemberIds}
        onSelectionChange={(ids: string[]) =>
          setSelectedMemberIds(
            ids.filter((id) => String(id) !== String(userId)),
          )
        }
      />
    </div>
  );
};

export default Members;
