"use client";

import UserDropdown1 from "@/components/auth/user-dropdown-1";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";

export function HeaderUserSection() {
  const { user, isLoaded } = useUser();

// if (!isLoaded) return <div className="h-10 w-20 animate-pulse rounded-full bg-sidebar-primary scale-90" />;
if (!isLoaded) return <Skeleton className="h-10 w-20 rounded-full"/>;

  return <UserDropdown1 user={user ?? undefined} />;
}
