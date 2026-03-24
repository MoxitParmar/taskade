import { api } from "@/convex/_generated/api";

import { useSmartQuery } from "@/hooks/use-smart-query";
import { useUserContext } from "@/hooks/use-user-context";

export const useDashboardCardData = () => {
    const user = useUserContext()?.data;
    
    const { data, isLoading } = useSmartQuery({
        query: api.dashboard.queries.getCardData,
        args: {userId: user?.userId , orgId: user?.orgId },
      mode: "simple",
    });

    return {
        data,
        isLoading,
    };
}