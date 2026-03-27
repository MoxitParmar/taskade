import { api } from "@/convex/_generated/api";
import { useMutationAction } from "@/hooks/use-mutation-action";
import { useSmartQuery } from "@/hooks/use-smart-query";

export const useDeleteMembership= () => {
  return useMutationAction(api.memberships.mutations.deleteMembership, {
    successMessage: "Membership deleted",
    errorMessage: "Failed to delete membership",
  });
};

export const useOrgMembersData = ({orgId}: {orgId: string}) => {

    
    const { data, isLoading, page, hasNext,hasPrev,setPage, goPrev, goNext} = useSmartQuery({
        query: api._settings.queries.getMembersData,
        args: {orgId},
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