import { api } from "@/convex/_generated/api";
import { useMutationAction } from "@/hooks/use-mutation-action";

import { useSmartQuery } from "@/hooks/use-smart-query";


export const useTaskData = ({  orgId, taskId }: { orgId: string; taskId: string }) => {

    
    const { data, isLoading } = useSmartQuery({
        query: api._task_id.queries.getTask,
        args: { taskId, orgId },
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

export const useDeleteTask= () => {
  return useMutationAction(api.tasks.mutations.deleteTask);
}

