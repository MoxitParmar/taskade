import { SidebarHeader, SidebarContent, Sidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";


export default function SidebarSkeleton() {
  return (
    <div>
        <Sidebar collapsible="offcanvas" variant="floating" >
          <SidebarHeader>
            <div className="p-3">
              {/* small header placeholder */}
              <Skeleton className="h-10 w-40 rounded-full" />
            </div>
          </SidebarHeader>
  
          <SidebarContent>
            <div className="p-3">
              <Skeleton className="w-full rounded-md h-[calc(100vh-10rem)]" />
            </div>
          </SidebarContent>
        </Sidebar>
    </div>
  );
}