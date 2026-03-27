import { Skeleton } from '@/components/ui/skeleton'
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '@/components/ui/table'


export default function TaskTableSkeleton() {
  return (
    <div>
              <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-10 pl-4">
                <span className="inline-block size-2.5 rounded-full bg-muted-foreground/40" />
              </TableHead>
              <TableHead className="min-w-50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Title
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Priority
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Assignee
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Due Date
              </TableHead>
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
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
