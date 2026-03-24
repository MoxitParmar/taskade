import { api } from "@/convex/_generated/api";

import { useSmartQuery } from "@/hooks/use-smart-query";
import { useUserContext } from "@/hooks/use-user-context";

export const useOrgActivityData = () => {
    const user = useUserContext()?.data;
    
    const { data, isLoading } = useSmartQuery({
        query: api.dashboard.queries.getOrgActivityData,
        args: { orgId: user?.orgId },
      mode: "simple",
    });

    return {
        data,
      isLoading,
    };
}