"use client";

import React from "react";
import { useProjectsData } from "../_hooks/useProjects";
import { ProjectCard } from "./project-card";
import PaginationControls from "../../../../components/paginate";
import CardSkeleton from "./card-skeleton";
import { Id } from "@/convex/_generated/dataModel";
import { Project } from "@/convex/projects/models";

export default function ProjectPage({
  search,
  status,
  userId,
  orgId,
}: {
  search: string;
  status: string;
  userId: Id<"users">;
  orgId: Id<"organizations">;
}) {

  const queryArgs = React.useMemo(
    () => ({
      search,
      status,
      userId,
      orgId,
    }),
    [search, status, userId, orgId],
  );

  const { data, isLoading, page, hasNext, hasPrev, goPrev, goNext, setPage } = useProjectsData(queryArgs);
  const safeGoPrev = goPrev ?? (() => {});
  const safeGoNext = goNext ?? (() => {});

  return (
    <div>
      {isLoading ? (
        <CardSkeleton />
      ) : data?.length ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {data?.map((p: Project) => (
            <ProjectCard key={p._id} project={p} />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-gray-600 py-16 text-center">
          <p className="text-lg font-medium text-gray-300">No projects found</p>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      <PaginationControls
        page={page}
        isFirstPage={!hasPrev}
        hasNextPage={hasNext}
        goPrev={safeGoPrev}
        goNext={safeGoNext}
        syncWithUrl
        urlPageParam="page"
        onPageFromUrl={setPage}
        resetKeys={["search", "status"]}
        className="mt-8"
      />
    </div>
  );
}
