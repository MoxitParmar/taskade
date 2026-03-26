import { api } from "@/convex/_generated/api";

import { useSmartQuery } from "@/hooks/use-smart-query";


export const useProjectMembersData = ({ projectId, orgId }: { projectId: string; orgId: string }) => {

    
    const { data, isLoading } = useSmartQuery({
        query: api._project_id.queries.getMembersData,
        args: { orgId, projectId },
      mode: "simple",
    });

    return {
        data,
        isLoading,
    };
}

export const useProjectData = ({ projectId, orgId }: { projectId: string; orgId: string }) => {

    
    const { data, isLoading } = useSmartQuery({
        query: api._project_id.queries.getProject,
        args: { projectId, orgId },
      mode: "simple",
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
      mode: "simple",
    });

    return {
        data,
        isLoading,
    };
}
