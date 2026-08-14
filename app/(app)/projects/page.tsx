"use client";

import React, { Suspense } from "react";
import ProjectHeader from "./_components/project-header";
import ProjectToolbar from "./_components/project-toolbar";
import ProjectPage from "./_components/project-page";
import { Id } from "@/convex/_generated/dataModel";
import { useUserContext } from "@/hooks/use-user-context";
import { useSmartUrlSync } from "@/hooks/use-smart-url-sync";

type ProjectsQueryState = {
  search: string;
  status: string;
  page: string;
};

function ProjectsContent() {
    const defaultQueryState = React.useMemo<ProjectsQueryState>(
      () => ({
        search: "",
        status: "",
        page: "1",
      }),
      [],
    );

    const [queryState, setQueryState] = React.useState<ProjectsQueryState>(defaultQueryState);

    const { setQueryValue, reset } = useSmartUrlSync<ProjectsQueryState>({
      state: queryState,
      setState: setQueryState,
      keys: ["search", "status", "page"],
      defaultState: defaultQueryState,
      debouncedKeys: ["search"],
      debounceMs: 350,
      method: "replace",
      pageParam: "page",
      resetPageOn: ["search", "status"],
    });

    const userData = useUserContext()?.data;
    const userId = userData?.userId as Id<"users">;
    const orgId = userData?.orgId as Id<"organizations">;
    
  return (
    <div className="app-page">
          <ProjectHeader userId={userId} orgId={orgId} />
          <ProjectToolbar
            search={queryState.search}
            status={queryState.status}
            onSearchChange={(value) => setQueryValue("search", value)}
            onStatusChange={(value) => setQueryValue("status", value)}
            onReset={reset}
          />
          
          <ProjectPage
            search={queryState.search}
            status={queryState.status}
            userId={userId}
            orgId={orgId}
          />
    </div>
  );
}

export default function Projects() {
  return (
    <Suspense fallback={<div className="app-page" />}>
      <ProjectsContent />
    </Suspense>
  );
}
