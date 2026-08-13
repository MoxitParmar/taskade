import { SidebarHeader, SidebarContent, Sidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";


export default function SidebarSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-7 w-45 mx-3 mt-9" />
      <Skeleton className="h-7 w-45 mx-3 " />
      <Skeleton className="h-7 w-45 mx-3 " />
      <Skeleton className="h-7 w-45 mx-3 " />
      <Skeleton className="h-7 w-45 mx-3 mt-9" />
      <Skeleton className="h-5 w-30 mx-3 " />
      <Skeleton className="h-5 w-30 mx-3 " />
      <Skeleton className="h-5 w-30 mx-3 " />
      <Skeleton className="h-7 w-45 mx-3 mt-9" />
      <Skeleton className="h-5 w-30 mx-3 " />
      <Skeleton className="h-5 w-30 mx-3 " />
      <Skeleton className="h-5 w-30 mx-3 " />

    </div>
  );
}