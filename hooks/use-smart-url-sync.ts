"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type QueryState = Record<string, string>;

type UseUrlQuerySyncOptions<T extends QueryState> = {
  state: T;
  setState: React.Dispatch<React.SetStateAction<T>>;
  keys: Array<keyof T>;
  defaultState: T;
  debouncedKeys?: Array<keyof T>;
  debounceMs?: number;
  method?: "replace" | "push";
  pageParam?: keyof T;
  resetPageOn?: Array<keyof T>;
  onSync?: (next: T) => void;
};

type UseUrlQuerySyncReturn<T extends QueryState> = {
  setQueryValue: <K extends keyof T>(key: K, value: T[K]) => void;
  setMany: (partial: Partial<T>) => void;
  reset: () => void;
  replaceStateFromUrl: () => void;
};

function shallowEqual<T extends QueryState>(a: T, b: T): boolean {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  for (const key of aKeys) {
    if (a[key] !== b[key]) return false;
  }
  return true;
}

function parseFromParams<T extends QueryState>(
  params: URLSearchParams,
  keys: Array<keyof T>,
  defaults: T,
): T {
  const next = { ...defaults } as T;
  keys.forEach((key) => {
    const raw = params.get(String(key));
    next[key] = (raw ?? defaults[key] ?? "") as T[keyof T];
  });
  return next;
}

function buildUrl<T extends QueryState>(
  pathname: string,
  currentParams: URLSearchParams,
  keys: Array<keyof T>,
  defaults: T,
  state: T,
): string {
  const params = new URLSearchParams(currentParams.toString());

  keys.forEach((key) => {
    const k = String(key);
    const value = state[key] ?? "";
    const defaultValue = defaults[key] ?? "";

    if (value === "" || value === defaultValue) params.delete(k);
    else params.set(k, value);
  });

  const entries = Array.from(params.entries()).sort(([a], [b]) =>
    a.localeCompare(b),
  );
  const sorted = new URLSearchParams(entries);
  const qs = sorted.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

function withPageReset<T extends QueryState>(
  prev: T,
  next: T,
  pageParam?: keyof T,
  resetPageOn: Array<keyof T> = [],
): T {
  if (!pageParam || resetPageOn.length === 0) return next;

  const changedKeys = Object.keys(next).filter(
    (k) => prev[k as keyof T] !== next[k as keyof T],
  ) as Array<keyof T>;

  const shouldResetPage =
    changedKeys.some((k) => resetPageOn.includes(k)) &&
    changedKeys.some((k) => k !== pageParam);

  if (!shouldResetPage) return next;
  if (next[pageParam] === "1") return next;

  return {
    ...next,
    [pageParam]: "1",
  };
}

export function useSmartUrlSync<T extends QueryState>({
  state,
  setState,
  keys,
  defaultState,
  debouncedKeys = [],
  debounceMs = 350,
  method = "replace",
  pageParam,
  resetPageOn = [],
  onSync,
}: UseUrlQuerySyncOptions<T>): UseUrlQuerySyncReturn<T> {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const paramsString = searchParams.toString();
  const paramsStringRef = React.useRef(paramsString);
  const debounceTimerRef = React.useRef<number | null>(null);
  const prevStateRef = React.useRef<T>(state);
  const sourceRef = React.useRef<"url" | "state" | null>(null);

  paramsStringRef.current = paramsString;
  const keysRef = React.useRef<Array<keyof T>>(keys);
  const defaultStateRef = React.useRef<T>(defaultState);
  const debouncedKeysRef = React.useRef<Array<keyof T>>(debouncedKeys);
  const resetPageOnRef = React.useRef<Array<keyof T>>(resetPageOn);
  const pageParamRef = React.useRef<keyof T | undefined>(pageParam);
  const methodRef = React.useRef<"replace" | "push">(method);
  const onSyncRef = React.useRef<typeof onSync>(onSync);

  const keysSignature = React.useMemo(
    () => keys.map((k) => String(k)).join("|"),
    [keys],
  );
  const debouncedSignature = React.useMemo(
    () => debouncedKeys.map((k) => String(k)).join("|"),
    [debouncedKeys],
  );
  const resetPageSignature = React.useMemo(
    () => resetPageOn.map((k) => String(k)).join("|"),
    [resetPageOn],
  );
  const defaultStateSignature = React.useMemo(
    () => JSON.stringify(defaultState),
    [defaultState],
  );

  React.useEffect(() => {
    keysRef.current = keys;
  }, [keysSignature, keys]);

  React.useEffect(() => {
    defaultStateRef.current = defaultState;
  }, [defaultStateSignature, defaultState]);

  React.useEffect(() => {
    debouncedKeysRef.current = debouncedKeys;
  }, [debouncedSignature, debouncedKeys]);

  React.useEffect(() => {
    resetPageOnRef.current = resetPageOn;
  }, [resetPageSignature, resetPageOn]);

  React.useEffect(() => {
    pageParamRef.current = pageParam;
  }, [pageParam]);

  React.useEffect(() => {
    methodRef.current = method;
  }, [method]);

  React.useEffect(() => {
    onSyncRef.current = onSync;
  }, [onSync]);

  const applyNextState = React.useCallback(
    (updater: (prev: T) => T) => {
      setState((prev) => {
        const updated = updater(prev);
        const withReset = withPageReset(
          prev,
          updated,
          pageParamRef.current,
          resetPageOnRef.current,
        );
        return shallowEqual(prev, withReset) ? prev : withReset;
      });
    },
    [setState],
  );

  const setQueryValue = React.useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      applyNextState((prev) => ({ ...prev, [key]: value }));
    },
    [applyNextState],
  );

  const setMany = React.useCallback(
    (partial: Partial<T>) => {
      applyNextState((prev) => ({ ...prev, ...partial }));
    },
    [applyNextState],
  );

  const reset = React.useCallback(() => {
    const defaults = defaultStateRef.current;
    setState((prev) => (shallowEqual(prev, defaults) ? prev : { ...defaults }));
  }, [setState]);

  const replaceStateFromUrl = React.useCallback(() => {
    const parsed = parseFromParams(
      new URLSearchParams(paramsString),
      keysRef.current,
      defaultStateRef.current,
    );
    setState((prev) => {
      if (shallowEqual(prev, parsed)) return prev;
      sourceRef.current = "url";
      return parsed;
    });
    onSyncRef.current?.(parsed);
  }, [paramsString, setState]);

  React.useEffect(() => {
    replaceStateFromUrl();
  }, [replaceStateFromUrl]);

  React.useEffect(() => {
    const prev = prevStateRef.current;
    if (shallowEqual(prev, state)) return;

    prevStateRef.current = state;

    if (sourceRef.current === "url") {
      sourceRef.current = null;
      return;
    }

    const changedKeys = (Object.keys(state) as Array<keyof T>).filter(
      (k) => prev[k] !== state[k],
    );

    if (changedKeys.length === 0) return;

    const debouncedSet = new Set<keyof T>(debouncedKeysRef.current);
    const onlyDebouncedChanged = changedKeys.every((k) => debouncedSet.has(k));

    const runSync = () => {
      const liveParamsString = paramsStringRef.current;
      const currentUrl = liveParamsString ? `${pathname}?${liveParamsString}` : pathname;
      const nextUrl = buildUrl(
        pathname,
        new URLSearchParams(liveParamsString),
        keysRef.current,
        defaultStateRef.current,
        state,
      );

      if (nextUrl !== currentUrl) {
        if (methodRef.current === "replace") router.replace(nextUrl, { scroll: false });
        else router.push(nextUrl, { scroll: false });
      }

      onSyncRef.current?.(state);
    };

    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    if (onlyDebouncedChanged) {
      debounceTimerRef.current = window.setTimeout(runSync, debounceMs);
      return () => {
        if (debounceTimerRef.current !== null) {
          window.clearTimeout(debounceTimerRef.current);
          debounceTimerRef.current = null;
        }
      };
    }

    runSync();
    return undefined;
  }, [
    state,
    debounceMs,
    pathname,
    router,
    paramsString,
  ]);

  return {
    setQueryValue,
    setMany,
    reset,
    replaceStateFromUrl,
  };
}
