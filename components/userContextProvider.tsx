"use client";

import { createContext, useContext, useMemo } from "react";
import { api } from "@/convex/_generated/api";
import { useSmartQuery } from "@/hooks/use-smart-query";
import { Id } from "@/convex/_generated/dataModel";

// type UserContextValue = {
//   userId: string | null;
//   orgId: string | null;
//   isLoading: boolean;
// };
// 
type data = {
    clerkUserId: string;
    clerkOrgId: string;
    userId: Id<"users">;
    orgId: Id<"organizations">;
    user: {
        _id: Id<"users">;
        _creationTime: number;
        clerkUserId: string;
        name: string;
        imageUrl: string;
        email: string;
        createdAt: number;
        updatedAt: number;
    };
    org: {
        _id: Id<"organizations">;
        _creationTime: number;
        imageUrl: string;
        createdAt: number;
        updatedAt: number;
        clerkOrgId: string;
        orgName: string;
    } | undefined,
} | null

type isLoading = boolean

type UserContextValue = {
    data: data;
    isLoading: isLoading;
}

const UserContext = createContext<UserContextValue>({
    data: null,
  isLoading: true,
});

export function UserContextProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useSmartQuery({
    query: api.lib.auth.getViewerContext,
    args: {},
    mode: "simple",
  });

  const value = useMemo(
    () => ({
      data,
      isLoading,
    }),
    [data, isLoading]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContextValue() {
  return useContext(UserContext);
}