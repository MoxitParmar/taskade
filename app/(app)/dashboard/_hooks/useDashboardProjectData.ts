import { api } from "@/convex/_generated/api";

import { useSmartQuery } from "@/hooks/use-smart-query";

export const useDashboardProjectData = ({userId, orgId}: {userId: string, orgId: string}) => {

    
    const { data, isLoading } = useSmartQuery({
        query: api.dashboard.queries.getProjectData,
        args: {userId, orgId },
      mode: "simple",
    });

    return {
        data,
      isLoading,
    };
}