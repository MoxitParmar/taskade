import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Doc } from "@/convex/_generated/dataModel";

type Project = Doc<"projects">;
import { usePaginatedQuery } from "@/hooks/use-paginated";
import { FolderOpen } from "lucide-react";
import React from "react";


export const useRecentProjects = (userId: Id<"users">, orgId: Id<"organizations">) => {
    const query = usePaginatedQuery<Project, {
        orgId: Id<"organizations">;
        userId: Id<"users">;
    }> ({
      query: api.projects.queries.getProjects,
      args: { orgId, userId },
      pageSize: 5,
      resetDeps: [orgId, userId],
    });
    const projects = React.useMemo(() => {

      const projects = query.data.map((p) => ({
          title: p.name,
          url: `/project/${p._id}`,
        }));
      return [
        {
          title: "My Projects",
          url: "#",
          icon: FolderOpen,
          isActive: true,
          items: projects,
        },
      ];
    }, [query.data]);
    
    return {
      projects,
      isLoading: query.isLoading,
      isEmpty: query.isEmpty,
    };
}