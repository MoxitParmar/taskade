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
import { FolderOpen, ListChecks } from "lucide-react";
import { NavDrop } from "./nav-dropdown";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { projects , tasks , isLoading, pages } = useAppSidebar();
    const formatedProjects = React.useMemo(() => {
      const items = projects?.page.map((p: { name: string; _id: string }) => ({
        title: p.name,
        url: `/project/${p._id}`,
      }));
    
      return [
        {
          title: "My Projects",
          url: "/projects",
          icon: FolderOpen,
          isActive: true,
          items,
        },
      ];
    }, [projects]);
    const formatedTasks = React.useMemo(() => {
      const items = tasks?.page.map((p: { name: string; _id: string }) => ({
        title: p.name,
        url: `/task/${p._id}`,
      }));
    
      return [
        {
          title: "My Tasks",
          url: "/tasks",
          icon: ListChecks,
          isActive: true,
          items,
        },
      ];
    }, [tasks]);

    if (isLoading) {
    return <SidebarSkeleton />;
  }
  // Normal sidebar rendering when not loading
  return (
    <Sidebar collapsible="offcanvas" variant="floating" {...props}>
      <SidebarHeader>
        <OrgSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavPages projects={pages} />
        <NavDrop items={formatedTasks}  />
        <NavDrop items={formatedProjects}  />
      </SidebarContent>
    </Sidebar>
  );
}
