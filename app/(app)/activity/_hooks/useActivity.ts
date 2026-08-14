import { api } from "@/convex/_generated/api";
import { normalizeFilter } from "../../projects/[id]/_hooks/useProject";
import { useSmartQuery } from "@/hooks/use-smart-query";

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