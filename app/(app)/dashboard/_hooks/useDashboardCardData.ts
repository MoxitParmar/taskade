import { api } from "@/convex/_generated/api";

import { useSmartQuery } from "@/hooks/use-smart-query";

export const useDashboardCardData = ({userId, orgId}: {userId: string, orgId: string}) => {
    
    const { data, isLoading } = useSmartQuery({
        query: api.dashboard.queries.getCardData,
        args: {userId, orgId },
      mode: "simple",
    });

    return {
        data,
        isLoading,
    };
}