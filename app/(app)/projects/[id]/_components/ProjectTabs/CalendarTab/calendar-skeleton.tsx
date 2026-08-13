import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-8 w-36" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="rounded-md p-1">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="space-y-4">
        <div className="rounded-xl border bg-card p-4">
          <Skeleton className="h-6 w-40 mb-10" />
          {Array.from({ length: 1 }).map((_, i) => (
            <div key={i} className="mb-2">
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
              <div className="rounded-xl border bg-card p-4">
          <Skeleton className="h-6 w-40 mb-10" />
          {Array.from({ length: 1 }).map((_, i) => (
            <div key={i} className="mb-2">
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
