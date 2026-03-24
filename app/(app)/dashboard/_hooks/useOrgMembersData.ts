import { api } from "@/convex/_generated/api";

import { useSmartQuery } from "@/hooks/use-smart-query";
import { useUserContext } from "@/hooks/use-user-context";

export const useOrgMembersData = () => {
    const userData = useUserContext()?.data;
    
    const { data, isLoading } = useSmartQuery({
        query: api.dashboard.queries.getMembersData,
        args: { orgId: userData?.orgId },
      mode: "simple",
    });

    return {
        data,
        isLoading,
        userData
    };
}