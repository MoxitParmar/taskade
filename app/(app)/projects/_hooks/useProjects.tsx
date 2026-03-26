import { api } from "@/convex/_generated/api";

import { useSmartQuery } from "@/hooks/use-smart-query";

export const useProjectsData = ({search, status, userId, orgId}: {search: string, status: string, userId: string, orgId: string}) => {
    
    const { data, isLoading, page, hasNext,hasPrev,setPage, goPrev, goNext } = useSmartQuery({
        query: api._projects.queries.getProjectData,
        args: {userId, orgId, search, status },
        mode: "paginated",
        pageSize: 9,
    });


    return {
        data,page, hasNext, hasPrev,goPrev, goNext,setPage,
      isLoading,
    };
}