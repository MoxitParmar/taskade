
import { api } from "@/convex/_generated/api";
import { pages, pagesSetting } from "./pages";
import { useOrganization } from "@clerk/nextjs";

import { useSmartQuery } from "@/hooks/use-smart-query";

export const useAppSidebar = () => {
    const { membership } = useOrganization();
    const isAdmin = membership?.role === "org:admin";
    const pagesWithSettings = isAdmin ? pagesSetting : pages;
    
    const { data, isLoading } = useSmartQuery({
        query: api.sidebar.queries.getSidebarData,
        args: {},
      mode: "simple",
    });
    const { projects, tasks} = data ?? {};

    
    return {
     projects, tasks,
      isLoading,
       pages: pagesWithSettings,
    };
}
