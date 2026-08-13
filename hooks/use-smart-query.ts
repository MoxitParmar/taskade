import { useEffect, useState } from "react";
import { useQuery } from "convex/react";

export type PaginatedResult<T> = {
  page: T[];
  continueCursor: string | null;
  isDone: boolean;
};

type Options<TArgs> = {
    //eslint-disable-next-line    
  query: any | null;
  args?: TArgs;
    pageSize?: number;
  //eslint-disable-next-line
  resetDeps?: any[];


  mode?: "paginated" | "simple";
};

export const useSmartQuery = <TData, TArgs extends object>({
  query,
  args,
  pageSize = 10,
  resetDeps = [],
  mode = "simple", 
}: Options<TArgs>) => {
  const resetKey = JSON.stringify(resetDeps);

  const [state, setState] = useState<{
    page: number;
    cursorMap: Record<number, string | null>;
    key: string;
  }>(() => ({
    page: 1,
    cursorMap: { 1: null },
    key: resetKey,
  }));

  const isReset = state.key !== resetKey;

  const page = isReset ? 1 : state.page;
  const cursorMap = isReset ? { 1: null } : state.cursorMap;

  const cursor = page === 1 ? undefined : cursorMap[page];

  const hasInvalidArgs =
    !args ||
    Object.values(args).some((v) => v === null || v === undefined) ;

    const shouldFetch = !!query && !hasInvalidArgs;


  /* -------------------------------------------------- */
  /* 🧠 QUERY EXECUTION */
  /* -------------------------------------------------- */

  const result = useQuery(
    shouldFetch ? query : "skip",
    shouldFetch
      ? mode === "paginated"
        ? {
            ...args,
            cursor,
            limit: pageSize,
          }
        : args 
      : "skip"
  );

  const isLoading = shouldFetch ? result === undefined : true;


  useEffect(() => {
    if (mode !== "paginated") return;
    if (!result?.continueCursor) return;

    const nextPage = page + 1;

    const currentMap = isReset ? { 1: null } : state.cursorMap;
    if (currentMap[nextPage]) return;
//eslint-disable-next-line
    setState({
      page,
      key: resetKey,
      cursorMap: {
        ...currentMap,
        [nextPage]: result.continueCursor,
      },
    });
  }, [result, page, resetKey, isReset, state.cursorMap, mode]);

  const goPrev = () => {
    if (page > 1) setPage(page - 1);
  };
  const goNext = () => {
    setPage(page + 1);
  };
  const setPage = (nextPage: number) => {
    if (mode !== "paginated") return; // ❗ no-op in simple mode

    if (nextPage < 1) return;

    if (nextPage === 1) {
      setState({
        page: 1,
        cursorMap: { 1: null },
        key: resetKey,
      });
      return;
    }

    const nextCursor = cursorMap[nextPage];
    if (!nextCursor) return;
    
    setState({
      page: nextPage,
      cursorMap: state.cursorMap,
      key: resetKey,
    });
  };
  if (mode === "simple") {
    return {
      data: result ?? null, 
      isLoading,
      isEmpty: !isLoading && !result,
      page: 1,
      setPage: () => {},
      hasNext: false,
      hasPrev: false,
    };
  }


  const typed = result as PaginatedResult<TData> | undefined;

  return {
    data: typed?.page ?? [],
    isLoading,
    isEmpty: query && !isLoading && (typed?.page.length ?? 0) === 0,
    page,
    setPage,
    hasNext: query ? !typed?.isDone : false,
    hasPrev: page > 1,
    goPrev,
    goNext,
  };
};