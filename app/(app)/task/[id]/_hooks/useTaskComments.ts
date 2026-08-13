import { api } from "@/convex/_generated/api";
import { useMutationAction } from "@/hooks/use-mutation-action";

import { useSmartQuery } from "@/hooks/use-smart-query";


export const useTaskComments = ({ taskId, orgId }: { taskId: string; orgId: string }) => {

    
    const { data, isLoading } = useSmartQuery({
        query: api._comments.queries.getComments,
        args: { taskId, orgId },
    });

    return {
        data,
        isLoading,
    };
}


  export const useCreateComment=() => {
  return useMutationAction(api.comments.mutations.createComment, {
    successMessage: "Comment created",
    errorMessage: "Failed to create comment",
  });
};

  export const useUpdateComment= () => {
  return useMutationAction(api.comments.mutations.updateComment, {
    successMessage: "Comment updated",
    errorMessage: "Failed to update comment",
  });
};


export const useDeleteComment= () => {
  return useMutationAction(api.comments.mutations.deleteComment);
}