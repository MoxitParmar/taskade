import { pages } from "./pages";
import { useAddSettings } from "./useAddSettings";
import { useRecentTasks } from "./useRecentTasks";
import { useRecentProjects } from "./useRecentProjects";
import { useUserData } from "./useUserData";

export const useAppSidebar = () => {
    const { data, isLoading: userLoading } = useUserData();
    const {userId, orgId} = data || {};
    useAddSettings(pages);
    const {tasks, isLoading: tasksLoading, isEmpty: tasksEmpty} = useRecentTasks(userId!, orgId!);
    const { projects, isLoading: projectsLoading, isEmpty: projectsEmpty } = useRecentProjects(userId!, orgId!);
    
    return {
      tasks,
      projects,
      isLoading: tasksLoading && projectsLoading && userLoading,
      tasksEmpty,projectsEmpty
    };
}
