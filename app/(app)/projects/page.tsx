"use client";

import React from "react";
import ProjectHeader from "./_components/project-header";
import ProjectToolbar from "./_components/project-toolbar";
import ProjectPage from "./_components/project-page";


export default function Dashboard() {
    const [search, setSearch] = React.useState("");
    const [status, setStatus] = React.useState("");

    
    
  return (
    <div>
          <ProjectHeader />
          <ProjectToolbar setSearch={setSearch} setStatus={setStatus} />
          
          <ProjectPage search={search} status={status}  />
      {/*<div className="grid gap-4 px-4 mt-8 grid-cols-2 lg:grid-cols-4 sm:px-8">
        <DashboardCard />
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 mt-6 sm:px-8 md:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-4">
          <ProjectOverview />
          <RecentActivity />
        </div>
        <TaskSummary />
      </div>*/}
    </div>
  );
}
