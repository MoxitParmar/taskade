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
import { Project, projectStatusStyles } from "../../dashboard/_config/projects";
import { User } from "@/convex/users/models";

interface ProjectCardProps {
  project: Project;
}
function getLeadName(lead: unknown) {
  if (!lead) return "—";
  if (typeof lead === "string") return lead;
  if (typeof lead === "object" && lead !== null && "name" in lead) {
    const maybeName = (lead as User).name;
    if (typeof maybeName === "string") return maybeName;
  }
  return "—";
}

export function ProjectCard({ project }: ProjectCardProps) {
  const status = projectStatusStyles[project.status];
  const leadName = getLeadName(project.lead);

  return (
    <Link href={`/projects/${project.id}`} className="block h-full">
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
