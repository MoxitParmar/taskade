import { query } from "@/convex/_generated/server";
import { getUserDataQuery } from "@/convex/lib/auth";


export const getDashboardData = query({
    args: {},
    
    handler: async (ctx) => {
        const user = await getUserDataQuery(ctx);
        const { userId, orgId } = user ?? {};
    },
});