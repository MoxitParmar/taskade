"use client"

import { useProjectsData } from "../_hooks/useProjectsData";
import { Project } from "../../dashboard/_config/projects";
import { ProjectCard } from "./project-card";
import PaginationControls from "../../_components/paginate";
import CardSkeleton from "./card-skeleton";


export default function ProjectPage({ search, status }: { search: string, status: string }) {
    const { data, isLoading, page, hasNext, hasPrev, goPrev, goNext } = useProjectsData({ search, status }); 
  return (
    <div>

          {isLoading ? (
            <CardSkeleton/>
                )
              : <div className="grid grid-cols-1 mt-8 mx-8 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">{data?.map((p: Project) => (
                  
                  <ProjectCard key={p.id} project={p} />
              ))}
                  </div>}
            
            <PaginationControls
              page={page}
              isFirstPage={!hasPrev}        
              hasNextPage={hasNext}
              goPrev={goPrev}
              goNext={goNext}
              className="mt-8 px-8"
            />
      </div>
    // </div>
  );
}
