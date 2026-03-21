"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavPages } from "./nav-pages";


import { useAppSidebar } from "../_hooks/useAppSidebar";
import SidebarSkeleton from "./sidebar-skeleton";
import { OrgSwitcher } from "./org-switcher";
import { NavDrop } from "./nav-dropdown";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { tasks, projects, isLoading, projectsEmpty, tasksEmpty, pages } =
    useAppSidebar();
    console.log("just logging tasks")
  if (isLoading) {
    <SidebarSkeleton />
  }

  // Normal sidebar rendering when not loading
  return (
    <Sidebar collapsible="offcanvas" variant="floating" {...props}>
      <SidebarHeader>
        <OrgSwitcher/>
      </SidebarHeader>
      <SidebarContent>
        <NavPages projects={pages} />
        <NavDrop items={tasks} empty={tasksEmpty} />
        <NavDrop items={projects} empty={projectsEmpty}/>
      </SidebarContent>
    </Sidebar>
  );
}
