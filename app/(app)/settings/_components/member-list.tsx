"use client";

import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrgMembersData } from "../_hooks/useSettings";
import { Membership } from "@/convex/memberships/models";
import PaginationControls from "../../_components/paginate";
import { getAvatarColor } from "../_config/avatar-colors";

export function ProjectMemberList({
  userId,
  orgId,
  selectedMemberIds: selectedMemberIdsProp,
  onSelectionChange,
}: {
  userId?:   string|null;
  orgId?: string|null;
  selectedMemberIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
}) {
    const { data: members, isLoading, page, hasNext, hasPrev, goPrev, goNext, setPage } = useOrgMembersData( { orgId } as {orgId: string});
  const safeGoPrev = goPrev ?? (() => {});
  const safeGoNext = goNext ?? (() => {});

  const selectableMembers = userId
    ? members.filter((m: Membership) => String(m?.user?._id) !== userId)
    : members;

  const allSelected = selectableMembers.length > 0 && selectedMemberIdsProp?.length === selectableMembers.length;

  const toggleSelectAll = () => {
    const allIds = selectableMembers.map((m: Membership) => String(m?.user?._id));
    if (onSelectionChange) {
      if (allSelected) onSelectionChange([]);
      else onSelectionChange(allIds);
    }
  };

  const toggleSelectOne = (memberId: string) => {
    if (userId && String(memberId) === userId) return;

    if (onSelectionChange) {
      if (selectedMemberIdsProp?.includes(memberId)) {
        onSelectionChange(selectedMemberIdsProp.filter((id) => id !== memberId));
      } else {
        onSelectionChange([...(selectedMemberIdsProp || []), memberId]);
      }
    }
  };


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Project members</h2>
        <p className="text-sm text-muted-foreground pr-2">{members.length} member{members.length === 1 ? "" : "s"}</p>
      </div>

      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-10 pl-4">
                    <span className="inline-block size-2.5 rounded-full bg-muted-foreground/40" />
                  </TableHead>
                  <TableHead className="min-w-50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Name
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell className="pl-4">
                      <Skeleton className="h-3 w-3 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-60" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 py-16">
            <p className="text-sm text-muted-foreground">No members found.</p>
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-10 pl-4">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      aria-pressed={allSelected}
                      className="inline-block cursor-pointer"
                    >
                      <span
                        className={cn(
                          "inline-block size-2.5 rounded-full",
                          allSelected ? "bg-accent-foreground" : "bg-muted-foreground/40",
                        )}
                      />
                    </button>
                  </TableHead>
                  <TableHead className="min-w-[200px] text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {members.map((member: Membership) => {
                  const initial = member?.user?.name ? member.user.name.charAt(0).toUpperCase() : "";

                  return (
                    <TableRow key={String(member?.user?._id)} className="border-t">
                      <TableCell className="pl-4">
                        {userId && String(member?.user?._id) === userId ? (
                          <span className="inline-block size-2.5 rounded-full bg-muted-foreground/30" title="Project admin" />
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleSelectOne(String(member?.user?._id))}
                            aria-pressed={selectedMemberIdsProp?.includes(String(member?.user?._id))}
                            className="inline-block cursor-pointer"
                          >
                            <span
                              className={cn(
                                "inline-block size-2.5 rounded-full",
                                selectedMemberIdsProp?.includes(String(member?.user?._id))
                                  ? "bg-accent-foreground"
                                  : "bg-muted-foreground/30",
                              )}
                            />
                          </button>
                        )}
                      </TableCell>

                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar size="sm" className="size-6">
                            <AvatarFallback className={cn("text-[10px] font-bold", getAvatarColor(member?.user?.name || ""))}>
                              {initial}
                            </AvatarFallback>
                          </Avatar>
                          <span>{member?.user?.name}</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-sm">{member?.user?.email}</TableCell>

                      <TableCell className="text-sm">{member?.role}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

            <PaginationControls
              page={page}
              isFirstPage={!hasPrev}
              hasNextPage={hasNext}
              goPrev={safeGoPrev}
              goNext={safeGoNext}
              syncWithUrl
              urlPageParam="page"
              onPageFromUrl={setPage}
              className="mt-8"
            />
    </div>
  );
}
