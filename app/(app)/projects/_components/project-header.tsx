"use client"
import { useOrganization } from "@clerk/nextjs";
import React from "react";
import { ProjectDialog } from "../../dashboard/_components/forms/project-form-dialog";
import { PageHeader } from "../../dashboard/_components/header";
import { HeaderSkeleton } from "../../dashboard/_components/skeleton/header";
import { useOrgMembersData } from "../../dashboard/_hooks/useOrgMembersData";

export default function ProjectHeader() {
  const { data, isLoading, userData } = useOrgMembersData();
  const { membership } = useOrganization();
  const isAdmin = membership?.role === "org:admin";


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
    <>
      {isLoading ? (
        <HeaderSkeleton />
      ) : (
        <PageHeader
          title={`Projects`}
          subtitle="Manage and track your projects"
          action={
            isAdmin && userData?.userId && userData?.orgId ? (
              <ProjectDialog
                userId={userData.userId}
                orgId={userData.orgId}
                members={memberOptions}
              />
            ) : null
          }
        />
      )}
    </>
  );
}