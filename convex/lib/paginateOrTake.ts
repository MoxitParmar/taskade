import { QueryCtx } from "../_generated/server";

type PaginatedResult<T> = {
  page: T[];
  continueCursor: string | null;
  isDone: boolean;
};

type Options<T> = {
    //eslint-disable-next-line
  query: any; // Convex query builder
  ctx: QueryCtx;
  limit?: number;
  cursor?: string;
  paginate?: boolean;
  //eslint-disable-next-line
  map: (item: any) => Promise<T>;
};

export async function paginateOrTake<T>({
  query,
  limit,
  cursor,
  paginate = true,
  map,
}: Options<T>): Promise<PaginatedResult<T>> {
  /* -------------------------------------------------- */
  /* 📄 PAGINATED */
  /* -------------------------------------------------- */
  if (paginate) {
    const result = await query.paginate({
      numItems: limit,
      cursor: cursor ?? null,
    });

    const page = await Promise.all(result.page.map(map));

    return {
      ...result,
      page,
    };
  }

  /* -------------------------------------------------- */
  /* ⚡ NON-PAGINATED */
  /* -------------------------------------------------- */
  const safeLimit = Math.min(limit ?? 50, 100);
  
    const items = await query.take(safeLimit);
    
  
    const page = await Promise.all(items.map(map));
  
  return {
    page,
    continueCursor: null,
    isDone: true,
  };
}