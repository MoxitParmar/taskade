import { pages } from "./pages";
import { useRecentTasks } from "./useRecentTasks";
import { useRecentProjects } from "./useRecentProjects";
import { useUserData } from "./useUserData";
import { Settings } from "lucide-react";
import { useOrganization } from "@clerk/nextjs";

export const useAppSidebar = () => {
    const { membership } = useOrganization();
    const isAdmin = membership?.role === "admin";
    
    const pagesWithSettings = [
      ...pages.filter(p => p.name !== "Settings"),
      ...(isAdmin
        ? [{ name: "Settings", url: "/settings", icon: Settings }]
        : []),
    ];

    const { data, isLoading: userLoading } = useUserData();
    const userId = data?.userId;
    const orgId = data?.orgId;
    const {tasks, isLoading: tasksLoading, isEmpty: tasksEmpty} = useRecentTasks(userId!, orgId!);
    const { projects, isLoading: projectsLoading, isEmpty: projectsEmpty } = useRecentProjects(userId!, orgId!);
    
    
    return {
      tasks,
      projects,
      isLoading: tasksLoading || projectsLoading || userLoading,
      tasksEmpty,projectsEmpty, pages: pagesWithSettings,
    };
}
