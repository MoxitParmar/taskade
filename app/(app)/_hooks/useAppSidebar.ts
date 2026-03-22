
import { api } from "@/convex/_generated/api";
import { pages, pagesSetting } from "./pages";
import { useOrganization } from "@clerk/nextjs";

import { usePaginatedQuery } from "@/hooks/use-paginated";

export const useAppSidebar = () => {
    const { membership } = useOrganization();
    const isAdmin = membership?.role === "org:admin";
    const pagesWithSettings = isAdmin ? pagesSetting : pages;
    
    const { data, isLoading, isEmpty } = usePaginatedQuery({
        query: api.sidebar.queries.getSidebarData,
        args: {},
      mode: "simple",
    });
    const { projects, tasks} = data ?? {};
    
    // let projects;
    // let tasks;
    // const formatedData = React.useMemo(() => {
    //   projects = data.project.map((p) => ({
    //       title: p.name,
    //       url: `/project/${p._id}`,
    //     }));
    //   return [
    //     {
    //       title: "My Projects",
    //       url: "#",
    //       icon: FolderOpen,
    //       isActive: true,
    //       items: projects,
    //     },
    //   ];
    // }, [query.data]);

    
    return {
     projects, tasks,
      isLoading,
      isEmpty, pages: pagesWithSettings,
    };
}
