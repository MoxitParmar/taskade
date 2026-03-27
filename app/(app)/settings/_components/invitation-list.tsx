"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";


interface Member {
  revoke: () => Promise<void>; // method to revoke invitation
  id: string;
  emailAddress: string;
}

export function InvitationList({
  invitations,
}: {
  invitations: any;
}) {
  const [members, setMembers] = React.useState<Member[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [count, setCount] = React.useState<number>(0);
  

  React.useEffect(() => {
    if (!invitations) {
      setMembers([]);
      setCount(0);
      setIsLoading(false);
      return;
    }
    const raw = Array.isArray(invitations.data) ? invitations.data : [];
    const data = raw.filter((it: any) => String(it.status).toLowerCase() === "pending");
    setMembers(data as Member[]);
    setCount(data.length);
    setIsLoading(Boolean(invitations.isLoading || invitations.isFetching));
  }, [invitations, invitations?.isLoading, invitations?.isFetching]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Invited members</h2>
        <p className="text-sm text-muted-foreground pr-2">
          {count} invitation{count === 1 ? "" : "s"}
        </p>
      </div>

      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 ">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
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
        ) : count === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 py-16">
            <p className="text-sm text-muted-foreground">
              No invitations found.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                
                  <TableHead className="text-xs pl-6  font-semibold uppercase tracking-wider text-muted-foreground">
                    Email
                  </TableHead>
                  <TableHead className="text-xs pl-4 font-semibold uppercase tracking-wider text-muted-foreground">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {members.map((member) => {
                 

                  return (
                    <TableRow key={String(member.id)} className="border-t">
                      <TableCell className="text-sm pl-6">
                        {member.emailAddress}
                      </TableCell>

                      <TableCell className="text-sm">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                          try {
                              await member.revoke();
                              // remove locally so list updates immediately
                              setMembers((prev) =>
                                prev.filter((m) => String(m.id) !== String(member.id)),
                              );
                              setCount((c) => Math.max(0, c - 1));
                            } catch (err) {
                              console.error("Revoke failed:", err);
                            }
                          }}
                          className="hover:text-destructive/80"
                        >
                          Revoke
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
