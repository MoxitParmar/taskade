import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export  function useUserData() {
    const userdata =  useQuery(api.users.queries.getUserData);
    const isLoading = userdata === undefined;
  
    if (isLoading) {
      return {
        data: undefined,
        isLoading: true,
      };
    }
    
    return {
      data: userdata,
      isLoading: false,
    };
}