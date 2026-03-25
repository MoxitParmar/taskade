import { api } from "@/convex/_generated/api";

import { useSmartQuery } from "@/hooks/use-smart-query";

export const useOrgMembersData = ({orgId, userId}: {orgId: string, userId: string}) => {

    
    const { data, isLoading } = useSmartQuery({
        query: api.dashboard.queries.getMembersData,
        args: { orgId, userId },
      mode: "simple",
    });

    return {
        data,
        isLoading,
    };
}