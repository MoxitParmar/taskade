"use client";

import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Project } from "@/convex/projects/models";
import { BadgeStyles } from "../../dashboard/_config/projects";


export function ProjectCard( {project } : { project: Project }) {
  const status = BadgeStyles[project.status];
  const leadName = project?.lead?.name;

  return (
    <Link href={`/projects/${project._id}`} className="block h-full">
      <Card className="h-full gap-4 cursor-pointer transition-colors duration-200 hover:border-accent-foreground/40">
        <CardHeader className="gap-0 pb-2">
          <CardTitle className="text-lg font-bold text-accent-400">
            {project.name}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-sm text-muted-foreground">
            {project.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-auto flex flex-col gap-3">
          {/* Status & Priority row */}
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className={cn(
                "rounded-md px-2.5 py-0.5 text-xs font-semibold",
                status.badgeClass,
              )}
            >
              {status.label}
            </Badge>
            <span className={cn("text-sm font-medium")}>Lead: {leadName}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
