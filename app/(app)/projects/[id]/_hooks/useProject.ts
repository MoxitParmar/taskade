import { api } from "@/convex/_generated/api";
import { useMutationAction } from "@/hooks/use-mutation-action";

import { useSmartQuery } from "@/hooks/use-smart-query";


export const useProjectMembersData = ({orgId, projectId}: {orgId: string; projectId: string}) => {

    
    const { data, isLoading, page, hasNext,hasPrev,setPage, goPrev, goNext} = useSmartQuery({
        query: api._project_id.queries.getMembersData,
        args: {orgId, projectId},
      mode: "paginated",
    });

    return {
        data,
        isLoading,
        page,
        hasNext,
        hasPrev,
        setPage,
        goPrev,
        goNext
    };
}
export const useProjectData = ({ projectId, orgId }: { projectId: string; orgId: string }) => {

    
    const { data, isLoading } = useSmartQuery({
        query: api._project_id.queries.getProject,
        args: { projectId, orgId },
    });

    return {
        data,
        isLoading,
    };
}

export const useProjectCardData = ({ projectId, orgId }: { projectId: string; orgId: string }) => {

    
    const { data, isLoading } = useSmartQuery({
        query: api._project_id.queries.getCardData,
        args: { projectId, orgId },
    });

    return {
        data,
        isLoading,
    };
}


  export const useCreateTask=() => {
  return useMutationAction(api.tasks.mutations.createTask, {
    successMessage: "Task created",
    errorMessage: "Failed to create task",
  });
};

  export const useUpdateTask= () => {
  return useMutationAction(api.tasks.mutations.updateTask, {
    successMessage: "Task updated",
    errorMessage: "Failed to update task",
  });
};
  export const useUpdateProject= () => {
  return useMutationAction(api.projects.mutations.updateProject, {
    successMessage: "Project updated",
    errorMessage: "Failed to update project",
  });
};

export const useDeleteTask= () => {
  return useMutationAction(api.tasks.mutations.deleteTask);
}
export const useDeleteProject= () => {
  return useMutationAction(api.projects.mutations.deleteProject);
}

export const useDeleteProjectMembership = () => {
  return useMutationAction(api.projects.mutations.removeProjectMember);
}

export const normalizeFilter = (value?: string) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
};
export const useProjectTasksData = ({orgId, projectId,status, priority, assigneeId}: {orgId: string; projectId: string, status?: string, priority?: string, assigneeId?: string}) => {

  const statusValue = normalizeFilter(status);
  const priorityValue = normalizeFilter(priority);
  const assigneeValue = normalizeFilter(assigneeId);

  const args: {
    orgId: string;
    projectId: string;
    status?: string;
    priority?: string;
    assigneeId?: string;
  } = { orgId, projectId };

  if (statusValue) args.status = statusValue;
  if (priorityValue) args.priority = priorityValue;
  if (assigneeValue) args.assigneeId = assigneeValue;

  const { data, isLoading, page, hasNext, hasPrev, setPage, goPrev, goNext } = useSmartQuery({
    query: api._project_id.queries.getProjectTaskData,
    args,
    mode: "paginated",
    resetDeps: [priority, status, assigneeId],
  });

  return {
    data,
    isLoading,
    page,
    hasNext,
    hasPrev,
    setPage,
    goPrev,
    goNext,
  };
}