"use client";
import { use } from 'react';
import ProjectHeader from './_components/project-header';
import { Id } from '@/convex/_generated/dataModel';
import { useUserContext } from '@/hooks/use-user-context';
import { useProjectData } from './_hooks/useProject';
import { HeaderSkeleton } from '../../dashboard/_components/skeleton/header';

export default function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const userData = useUserContext()?.data;
  const userId = userData?.userId as Id<"users">;
  const orgId = userData?.orgId as Id<"organizations">;
  const {data , isLoading} = useProjectData({ projectId: id as Id<"projects">, orgId });
  return (
    <div >
      {isLoading ? (<HeaderSkeleton />) : (
        <ProjectHeader project={data} userId={userId} orgId={orgId} />
      )}

    </div>
  )
}
