import { api } from "@/convex/_generated/api";

import { useSmartQuery } from "@/hooks/use-smart-query";

export const useDashboardCardData = ({userId, orgId}: {userId: string, orgId: string}) => {
    
    const { data, isLoading } = useSmartQuery({
        query: api._dashboard.queries.getCardData,
        args: {userId, orgId },
    });

    return {
        data,
        isLoading,
    };
}

export const useDashboardProjectData = ({userId, orgId}: {userId: string, orgId: string}) => {

    
    const { data, isLoading } = useSmartQuery({
        query: api._dashboard.queries.getProjectData,
        args: {userId, orgId },
    });

    return {
        data,
      isLoading,
    };
}

export const useUserActivityData = ({orgId, userId}: {orgId: string, userId: string}) => {

    
    const { data, isLoading } = useSmartQuery({
        query: api._dashboard.queries.getUserActivityData,
        args: { orgId, userId },
    });

    return {
        data,
      isLoading,
    };
}

export const useOrgMembersData = ({orgId, userId}: {orgId: string, userId: string}) => {

    
    const { data, isLoading } = useSmartQuery({
        query: api._dashboard.queries.getMembersData,
        args: { orgId, userId },
    });

    return {
        data,
        isLoading,
    };
}


export const useUserTasksData = ({userId, orgId}: {userId: string, orgId: string}) => {
    
    const { data, isLoading } = useSmartQuery({
        query: api._dashboard.queries.getUserTasksData,
        args: {userId, orgId },
    });

    return {
        data,
      isLoading,
    };
}
