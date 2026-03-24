
import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";

import { useSmartQuery } from "@/hooks/use-smart-query";

export const useDashboard = () => {
    const { membership } = useOrganization();
    const isAdmin = membership?.role === "org:admin";
    const { user } = useUser();

    
    const { data, isLoading } = useSmartQuery({
        query: api.dashboard.queries.getDashboardData,
        args: {},
      mode: "simple",
    });
    const { orgId, userId, members, cardData, projects, orgActivity, userTasks } = data ?? {};
    
    
    
    return {
         userId, orgId, members,user,cardData,projects,orgActivity, userTasks,
        isLoading,
        isAdmin,
    };
}
