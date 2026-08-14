import { api } from "@/convex/_generated/api";
import { useMutationAction } from "@/hooks/use-mutation-action";

import { useSmartQuery } from "@/hooks/use-smart-query";

export const useProjectsData = ({search, status, userId, orgId}: {search: string, status: string, userId: string, orgId: string}) => {
    
    const { data, isLoading, page, hasNext,hasPrev,setPage, goPrev, goNext } = useSmartQuery({
        query: api._projects.queries.getProjectData,
        args: {userId, orgId, search, status },
        mode: "paginated",
        pageSize: 9,
        resetDeps: [search, status],
    });


    return {
        data,page, hasNext, hasPrev,goPrev, goNext,setPage,
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