
import { api } from "@/convex/_generated/api";
import { pages, pagesSetting } from "../_config/pages";
import { useOrganization } from "@clerk/nextjs";

import { useSmartQuery } from "@/hooks/use-smart-query";
import { useUserContext } from "@/hooks/use-user-context";

export const useAppSidebar = () => {
    const { membership } = useOrganization();
    const isAdmin = membership?.role === "org:admin";
    const pagesWithSettings = isAdmin ? pagesSetting : pages;
    const user = useUserContext()?.data;
    
    const { data, isLoading } = useSmartQuery({
        query: api._sidebar.queries.getSidebarData,
        args: {userId: user?.userId , orgId: user?.orgId },
    });
    const { projects, tasks} = data ?? {};

    
    return {
     projects, tasks,
      isLoading,
       pages: pagesWithSettings,
    };
}

