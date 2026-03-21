import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Doc } from "@/convex/_generated/dataModel";

type Task = Doc<"tasks">;
import { usePaginatedQuery } from "@/hooks/use-paginated";
import { ListChecks } from "lucide-react";
import React from "react";

export const useRecentTasks = (userId: Id<"users">, orgId: Id<"organizations">)=> {

    const query = usePaginatedQuery<Task, {
    orgId: Id<"organizations">;
      userId: Id<"users">;
    }> ({
      query: api.tasks.queries.getTasks,
      args: { orgId, userId },
      pageSize: 5,
      resetDeps: [orgId, userId],
    });
    const tasks = React.useMemo(() => {
        console.log("just logging tasks")
      const tasks = query.data.map((task) => ({
          title: task.name,
          url: `/task/${task._id}`,
        }));
      return [
        {
          title: "My Tasks",
          url: "#",
          icon: ListChecks,
          isActive: true,
          items: tasks,
        },
      ];
    }, [query.data]);
    
    return {
      tasks,
      isLoading: query.isLoading,
      isEmpty: query.isEmpty,
    };
}