"use client";

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
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type PaginationControlsProps = {
  page: number;
  isFirstPage: boolean;
  hasNextPage: boolean;
  goPrev: () => void;
  goNext: () => void;
  syncWithUrl?: boolean;
  urlPageParam?: string;
  onPageFromUrl?: (page: number) => void;
  resetKeys?: string[];
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
  syncWithUrl = false,
  urlPageParam = "page",
  onPageFromUrl,
  resetKeys = [],
  className,
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getPageFromUrl = React.useCallback(() => {
    const raw = searchParams.get(urlPageParam);
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
  }, [searchParams, urlPageParam]);

  const setUrlPage = React.useCallback(
    (nextPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (nextPage <= 1) params.delete(urlPageParam);
      else params.set(urlPageParam, String(nextPage));

      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, urlPageParam, router, pathname],
  );

  // Hydrate local page state from URL page on load/refresh/query changes.
  React.useEffect(() => {
    if (!syncWithUrl || !onPageFromUrl) return;

    const pageFromUrl = getPageFromUrl();

    if (pageFromUrl <= 1) {
      if (page !== 1) onPageFromUrl(1);
      return;
    }

    if (page === pageFromUrl) return;

    // Move step-by-step so cursor-based paginators can resolve intermediate cursors.
    if (page < pageFromUrl) {
      if (hasNextPage) onPageFromUrl(page + 1);
      return;
    }

    onPageFromUrl(page - 1);
  }, [syncWithUrl, onPageFromUrl, getPageFromUrl, page, hasNextPage]);

  // If tracked filter keys change in URL, reset page back to 1.
  const resetSignature = React.useMemo(
    () => resetKeys.map((k) => `${k}:${searchParams.get(k) ?? ""}`).join("|"),
    [resetKeys, searchParams],
  );
  const prevResetSignatureRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!syncWithUrl || resetKeys.length === 0) return;

    if (prevResetSignatureRef.current === null) {
      prevResetSignatureRef.current = resetSignature;
      return;
    }

    if (prevResetSignatureRef.current !== resetSignature) {
      prevResetSignatureRef.current = resetSignature;
      setUrlPage(1);
      onPageFromUrl?.(1);
      return;
    }

    prevResetSignatureRef.current = resetSignature;
  }, [syncWithUrl, resetKeys.length, resetSignature, setUrlPage, onPageFromUrl]);

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
              if (!isFirstPage) {
                const next = Math.max(1, page - 1);
                if (syncWithUrl) setUrlPage(next);
                goPrev();
              }
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
              if (hasNextPage) {
                const next = page + 1;
                if (syncWithUrl) setUrlPage(next);
                goNext();
              }
            }}
            className={cn(!hasNextPage && "pointer-events-none opacity-50")}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
