import { api } from "@/convex/_generated/api";
import { useMutationAction } from "@/hooks/use-mutation-action";

import { useSmartQuery } from "@/hooks/use-smart-query";

export const useDashboardCardData = ({userId, orgId}: {userId: string, orgId: string}) => {
    
    const { data, isLoading } = useSmartQuery({
        query: api._dashboard.queries.getCardData,
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
        query: api._dashboard.queries.getProjectData,
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
        query: api._dashboard.queries.getOrgActivityData,
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
        query: api._dashboard.queries.getMembersData,
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
        query: api._dashboard.queries.getUserTasksData,
        args: {userId, orgId },
      mode: "simple",
    });

    return {
        data,
      isLoading,
    };
}

  export const useCreateProject=() => {
  return useMutationAction(api.projects.mutations.createProject, {
    successMessage: "Project created",
    errorMessage: "Failed to create project",
  });
};

  export const useUpdateProject= () => {
  return useMutationAction(api.projects.mutations.updateProject, {
    successMessage: "Project updated",
    errorMessage: "Failed to update project",
  });
};