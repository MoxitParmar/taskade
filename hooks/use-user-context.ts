"use client";

import { useUserContextValue } from "@/components/userContextProvider";


export function useUserContext() {
  return useUserContextValue();
}