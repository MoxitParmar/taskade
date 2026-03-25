import { use } from 'react';
import ProjectHeader from './_components/project-header';
import { Id } from '@/convex/_generated/dataModel';

export default function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <div className="flex flex-col gap-8 px-4 mt-8 pb-8 sm:px-8 md:px-16">
        <ProjectHeader projectId={id as Id<"projects">} />
    </div>
  )
}
