"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

type ProjectCardsSkeletonProps = {
  count?: number;
};

export function DashboardCardsSkeleton({ count = 4 }: ProjectCardsSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl">
          <div className="w-full">
            <Skeleton className="h-38 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </>
  );
}