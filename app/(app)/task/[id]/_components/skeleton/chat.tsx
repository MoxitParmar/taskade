import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function ChatSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-6 mt-4">
      {/* Chat card skeleton */}
      <div className="lg:col-span-2">
        <div className="p-4">
          <div className="p-0 space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        </div>
      </div>

      {/* TaskDetailsCard-sized skeleton */}
      <div className="space-y-6">
        <div className="p-4 pb-1 gap-2">
          <Skeleton className="h-5 w-32" />
          <div className="border-t-2 mt-3 pt-3 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
        <div className="p-4 pb-1 gap-2">
          <Skeleton className="h-5 w-32" />
          <div className="border-t-2 mt-3 pt-3 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
