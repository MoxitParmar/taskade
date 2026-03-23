import { Skeleton } from "@/components/ui/skeleton";

export function HeaderSkeleton() {
  return (
    <div className="mt-8 px-8 w-full flex items-center justify-between gap-6">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-10 w-80 max-w-[80vw]" />
        <Skeleton className="h-4 w-56 max-w-[60vw]" />
      </div>

      <div className="shrink-0">
        <Skeleton className="h-10 w-34" />
      </div>
    </div>
  );
}