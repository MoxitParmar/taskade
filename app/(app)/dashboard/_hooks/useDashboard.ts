import { api } from "@/convex/_generated/api";
import { useMutationAction } from "@/hooks/use-mutation-action";

import { useSmartQuery } from "@/hooks/use-smart-query";
import { normalizeFilter } from "../../projects/[id]/_hooks/useProject";

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
export const useActivityData = ({orgId, userId, type, assignee}: {orgId: string, userId: string, type?: "comment" | "task", assignee?: string}) => {
  const typeValue = normalizeFilter(type);
  const assigneeValue = normalizeFilter(assignee);
    const args: {
    orgId: string;
    userId: string;
    type?: string;
    assignee?: string;
  } = { orgId, userId };
    if (typeValue) args.type = typeValue;
    if (assigneeValue) args.assignee = assigneeValue;
    const { data, isLoading, page, hasNext,hasPrev,setPage, goPrev, goNext } = useSmartQuery({
        query: api._dashboard.queries.getActivity,
        args,
        mode: "paginated",
        resetDeps: [type, assignee],
    });

    return {
        data,page, hasNext, hasPrev,goPrev, goNext,setPage,
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

export const useAddProjectMember = () => {
  return useMutationAction(api.projects.mutations.addProjectMember, {
    successMessage: "Member added",
    errorMessage: "Failed to add member",
  });
};