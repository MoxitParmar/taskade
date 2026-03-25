import { api } from "@/convex/_generated/api";

import { useSmartQuery } from "@/hooks/use-smart-query";
import { useUserContext } from "@/hooks/use-user-context";

export const useProjectsData = ({search, status}: {search: string, status: string}) => {
    const user = useUserContext()?.data;
    
    const { data, isLoading, page, hasNext,hasPrev,setPage, goPrev, goNext } = useSmartQuery({
        query: api.projectsPage.queries.getProjectData,
        args: {userId: user?.userId, orgId: user?.orgId, search, status },
        mode: "paginated",
        pageSize: 9,
    });


    return {
        data,page, hasNext, hasPrev,goPrev, goNext,setPage,
      isLoading,
    };
}