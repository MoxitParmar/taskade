import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export  function useUserData() {
    const userdata =  useQuery(api.users.queries.getUserData);
    const isLoading = userdata === undefined;
  
    if (isLoading) {
      return {
        data: null,
        isLoading: true,
      };
    }
    
    if (!userdata) {
        throw new Error("User data not found");
    }
    
    return {
      data: userdata,
      isLoading: false,
    };
}