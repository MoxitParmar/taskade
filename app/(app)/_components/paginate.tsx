import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

type PaginationControlsProps = {
  page: number;
  isFirstPage: boolean;
  hasNextPage: boolean;
  goPrev: () => void;
  goNext: () => void;
  /**
   * If true, hide the pagination (matches your earlier snippet that checked filtersActive).
   * Optional — default false.
   */
  className?: string;
};

/**
 * PaginationControls
 *
 * Wraps your existing pagination primitives into a reusable component.
 * It renders only when: !filtersActive && (hasNextPage || !isFirstPage)
 */
export default function PaginationControls({
  page,
  isFirstPage,
  hasNextPage,
  goPrev,
  goNext,
  className,
}: PaginationControlsProps) {
  // match your original condition: only show when filters not active and there is a next page or not on first page
  if ((!hasNextPage && isFirstPage)) return null;

  return (
    <Pagination className={cn("mt-2 justify-end", className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (!isFirstPage) goPrev();
            }}
            className={cn(isFirstPage && "pointer-events-none opacity-50")}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            href="#"
            isActive
            onClick={(e) => e.preventDefault()}
          >
            {page}
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (hasNextPage) goNext();
            }}
            className={cn(!hasNextPage && "pointer-events-none opacity-50")}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
