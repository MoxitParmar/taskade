"use client";

import React from "react";
import ProjectHeader from "./_components/project-header";
import ProjectToolbar from "./_components/project-toolbar";
import ProjectPage from "./_components/project-page";
import { Id } from "@/convex/_generated/dataModel";
import { useUserContext } from "@/hooks/use-user-context";


export default function Projects() {
    const [search, setSearch] = React.useState("");
    const [status, setStatus] = React.useState("");
    const userData = useUserContext()?.data;
    const userId = userData?.userId as Id<"users">;
    const orgId = userData?.orgId as Id<"organizations">;
    
  return (
    <div>
          <ProjectHeader userId={userId} orgId={orgId} />
          <ProjectToolbar setSearch={setSearch} setStatus={setStatus} />
          
          <ProjectPage search={search} status={status} userId={userId} orgId={orgId} />
    </div>
  );
}
