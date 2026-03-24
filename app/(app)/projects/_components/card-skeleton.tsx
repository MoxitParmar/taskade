import { Skeleton } from "@/components/ui/skeleton";


export default function CardSkeleton() {
  return (
    <div>
        <div className="grid grid-cols-1 gap-4 mt-8 px-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="rounded-xl  space-y-3">
              <Skeleton className="h-34 w-full" />
            </div>
          ))}
        </div>
    </div>
  );
}