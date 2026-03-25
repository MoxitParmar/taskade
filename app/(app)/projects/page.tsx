"use client";

import React from "react";
import ProjectHeader from "./_components/project-header";
import ProjectToolbar from "./_components/project-toolbar";
import ProjectPage from "./_components/project-page";


export default function Projects() {
    const [search, setSearch] = React.useState("");
    const [status, setStatus] = React.useState("");
    
  return (
    <div>
          <ProjectHeader />
          <ProjectToolbar setSearch={setSearch} setStatus={setStatus} />
          
          <ProjectPage search={search} status={status}  />
    </div>
  );
}
