import { Skeleton } from "@/components/ui/skeleton";


export default function CardSkeleton() {
  return (
    <div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="rounded-xl  space-y-3">
              <Skeleton className="h-34 w-full" />
            </div>
          ))}
        </div>
    </div>
  );
}