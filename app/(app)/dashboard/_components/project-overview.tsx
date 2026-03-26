import Link from "next/link";
import { ArrowRight, Users, CalendarDays } from "lucide-react";
import { Card, CardHeader, CardTitle, CardAction } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { projectStatusStyles } from "../_config/projects";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardProjectData } from "../_hooks/useDashboard";
import { Project } from "@/convex/projects/models";


function ProjectItem({ project }: { project: Project }) {
  const config = projectStatusStyles[project.status];

  return (
    <div className="border-t border-border px-6 py-5 w-full transition-colors duration-150 hover:bg-accent/50 cursor-pointer">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold truncate">{project.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
            {project.description}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={cn(
              "rounded-md px-2.5 py-0.5 text-xs font-semibold",
              config?.badgeClass,
            )}
          >
            {config?.label}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Users className="size-3.5" />
          {project.members} members
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5" />
          {project.createdAt}
        </span>
      </div>
    </div>
  );
}

export function ProjectOverview({userId, orgId}: {userId: string, orgId: string}) {
    const { data, isLoading } = useDashboardProjectData({userId, orgId});
    
  return (
    <>
      {isLoading ? (
          <Skeleton className="h-64 w-full rounded-xl" />
      ) : (
        <Card className="gap-0 py-0 overflow-hidden cursor-pointer transition-colors duration-200 hover:border-accent-foreground/40">
          <CardHeader className="py-4">
            <CardTitle className="text-base font-semibold">
              Project Overview
            </CardTitle>
            <CardAction>
              <Link
                href="/projects"
                className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                View all
                <ArrowRight className="size-4" />
              </Link>
            </CardAction>
          </CardHeader>
          {data?.page?.slice(0, 3).map((project: Project) => (
            <Link
              key={project._id}
              href={`/projects/${project._id}`}
              className="w-full"
            >
              <ProjectItem key={project._id} project={project} />
            </Link>
          ))}
        </Card>
      )}
    </>
  );
}
//         <div className="grid grid-cols-1 gap-4 px-4 mt-6 sm:px-8 md:grid-cols-[2fr_1fr]">
//           {/* Left Column */}
//           <div className="flex flex-col gap-4">
//             {isLoading ? (
//               <Skeleton className="h-64 w-full rounded-xl" />
//             ) : (
//               <ProjectOverview data={projects?.page} />
//             )}
//             {isLoading ? (
//               <Skeleton className="h-64 w-full rounded-xl" />
//             ) : (
//               <RecentActivity data={orgActivity?.page} />
//             )}
//           </div>
