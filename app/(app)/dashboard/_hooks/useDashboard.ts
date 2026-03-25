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


export const useUserTasksData = ({userId, orgId}: {userId: string, orgId: string}) => {
    
    const { data, isLoading } = useSmartQuery({
        query: api.dashboard.queries.getUserTasksData,
        args: {userId, orgId },
      mode: "simple",
    });

    return {
        data,
      isLoading,
    };
}