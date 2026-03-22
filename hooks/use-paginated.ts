// // lib/hooks/use-paginated-query.ts
// import { useEffect, useState } from "react";
// import { useQuery } from "convex/react";

// type PaginatedResult<T> = {
//   page: T[];
//   continueCursor: string | null;
//   isDone: boolean;
// };

// type Options<TArgs> = {
//   //eslint-disable-next-line
//   query: any | null;
//   args?: TArgs;
//   pageSize?: number;
//   //eslint-disable-next-line
//   resetDeps?: any[];
// };

// export const usePaginatedQuery = <TData, TArgs extends object>({
//   query,
//   args,
//   pageSize = 10,
//   resetDeps = [],
// }: Options<TArgs>) => {
//   // 🔑 Reset key
//   const resetKey = JSON.stringify(resetDeps);

//   // 🔁 Single state container (avoids multiple setStates)
//   const [state, setState] = useState<{
//     page: number;
//     cursorMap: Record<number, string | null>;
//     key: string;
//   }>(() => ({
//     page: 1,
//     cursorMap: { 1: null },
//     key: resetKey,
//   }));

//   // 🧠 Derived state (NO effect reset)
//   const isReset = state.key !== resetKey;

//   const page = isReset ? 1 : state.page;
//   const cursorMap: Record<number, string | null> = isReset
//     ? { 1: null }
//     : state.cursorMap;

//   const cursor = page === 1 ? undefined : cursorMap[page];

//   const hasInvalidArgs =
//     !args ||
//     Object.values(args).some(
//       (v) => v === undefined || v === null
//     );

//   const shouldFetch = !!query && !hasInvalidArgs;

//   const result = useQuery(
//     shouldFetch ? query : "skip",
//     shouldFetch
//       ? {
//           ...args,
//           cursor,
//           limit: pageSize,
//         }
//       : "skip"
//   ) as PaginatedResult<TData> | undefined;

//   const isLoading = shouldFetch ? result === undefined : true;


//   // 📌 Store next cursor
//   useEffect(() => {
//     if (!result?.continueCursor) return;

//     const nextPage = page + 1;

//     // Check if cursor already exists before updating
//     const currentMap = isReset ? { 1: null } : state.cursorMap;
//     if (currentMap[nextPage]) return;

//     // This is a legitimate use case for setState in effect:
//     // We're synchronizing React state with external data from the query
//     // eslint-disable-next-line
//     setState({
//       page,
//       key: resetKey,
//       cursorMap: {
//         ...currentMap,
//         [nextPage]: result.continueCursor,
//       },
//     });
//   }, [result, page, resetKey, isReset, state.cursorMap]);

//   // 🔄 Page navigation
//   const setPage = (nextPage: number) => {
//     if (nextPage < 1) return;

//     if (nextPage === 1) {
//       setState({
//         page: 1,
//         cursorMap: { 1: null },
//         key: resetKey,
//       });
//       return;
//     }

//     const nextCursor = cursorMap[nextPage];
//     if (!nextCursor) return;

//     setState({
//       page: nextPage,
//       cursorMap: state.cursorMap,
//       key: resetKey,
//     });
//   };

//   return {
//     data: result?.page ?? [],
//     isLoading,
//     isEmpty: query && !isLoading && (result?.page.length ?? 0) === 0,
//     page,
//     setPage,
//     hasNext: query ? !result?.isDone : false,
//     hasPrev: page > 1,
//   };
// };
// lib/hooks/use-paginated-query.ts

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";

type PaginatedResult<T> = {
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

  // 🆕 NEW
  mode?: "paginated" | "simple";
};

export const usePaginatedQuery = <TData, TArgs extends object>({
  query,
  args,
  pageSize = 10,
  resetDeps = [],
  mode = "paginated", // ✅ default = backward compatible
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
    Object.values(args).some((v) => v === undefined || v === null) ;

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
        : args // ✅ simple mode → no cursor/limit
      : "skip"
  );

  const isLoading = shouldFetch ? result === undefined : true;

  /* -------------------------------------------------- */
  /* 📄 PAGINATED MODE */
  /* -------------------------------------------------- */

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

  /* -------------------------------------------------- */
  /* 🔄 PAGE NAVIGATION */
  /* -------------------------------------------------- */

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

  /* -------------------------------------------------- */
  /* 🎯 RETURN */
  /* -------------------------------------------------- */

  if (mode === "simple") {
    return {
      data: result ?? null, // 👈 full object
      isLoading,
      isEmpty: !isLoading && !result,
      page: 1,
      setPage: () => {},
      hasNext: false,
      hasPrev: false,
    };
  }

  // ✅ paginated (original behavior)
  const typed = result as PaginatedResult<TData> | undefined;

  return {
    data: typed?.page ?? [],
    isLoading,
    isEmpty: query && !isLoading && (typed?.page.length ?? 0) === 0,
    page,
    setPage,
    hasNext: query ? !typed?.isDone : false,
    hasPrev: page > 1,
  };
};