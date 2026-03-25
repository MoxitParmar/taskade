import { api } from "@/convex/_generated/api";

import { useSmartQuery } from "@/hooks/use-smart-query";

export const useOrgActivityData = ({orgId}: {orgId: string}) => {

    
    const { data, isLoading } = useSmartQuery({
        query: api.dashboard.queries.getOrgActivityData,
        args: { orgId },
      mode: "simple",
    });

    return {
        data,
      isLoading,
    };
}