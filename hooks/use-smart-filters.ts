"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Primitive = string | number | boolean;
type FiltersShape = Record<string, Primitive>;

type UseSmartFiltersOptions<T extends FiltersShape> = {
  defaults: T;
  debouncedKeys?: Array<keyof T>;
  debounceMs?: number;
  method?: "replace" | "push";
  onChange?: (filters: T) => void;
  /**
   * If true, when `defaults` prop changes, local filters reset to those defaults.
   * Default false for stability.
   */
  resetOnDefaultsChange?: boolean;
};

type UseSmartFiltersReturn<T extends FiltersShape> = {
  filters: T;
  setFilter: <K extends keyof T>(key: K, value: T[K]) => void;
  setFilters: React.Dispatch<React.SetStateAction<T>>;
  resetFilters: () => void;
};

function shallowEqual<T extends Record<string, unknown>>(a: T, b: T): boolean {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  for (const key of aKeys) {
    if (a[key] !== b[key]) return false;
  }
  return true;
}

function parseByDefault(raw: string | null, fallback: Primitive): Primitive {
  if (raw === null) return fallback;
  if (typeof fallback === "number") {
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  }
  if (typeof fallback === "boolean") {
    return raw === "true";
  }
  return raw;
}

function parseFromUrl<T extends FiltersShape>(params: URLSearchParams, defaults: T): T {
  const out = { ...defaults } as T;
  (Object.keys(defaults) as Array<keyof T>).forEach((key) => {
    out[key] = parseByDefault(params.get(String(key)), defaults[key]) as T[keyof T];
  });
  return out;
}

function buildUrl<T extends FiltersShape>(
  pathname: string,
  currentParams: URLSearchParams,
  defaults: T,
  filters: T,
): string {
  const params = new URLSearchParams(currentParams.toString());

  (Object.keys(defaults) as Array<keyof T>).forEach((key) => {
    const k = String(key);
    const value = String(filters[key]);
    const defaultValue = String(defaults[key]);

    // remove param when empty or default
    if (value === "" || value === defaultValue) {
      params.delete(k);
    } else {
      params.set(k, value);
    }
  });

  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function useSmartFilters<T extends FiltersShape>({
  defaults,
  debouncedKeys = [],
  debounceMs = 350,
  method = "replace",
  onChange,
  resetOnDefaultsChange = false,
}: UseSmartFiltersOptions<T>): UseSmartFiltersReturn<T> {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // stable signatures
  const paramsString = searchParams.toString();
  const defaultsSignature = React.useMemo(() => JSON.stringify(defaults), [defaults]);

  // refs
  const defaultsRef = React.useRef<T>(defaults);
  const prevFiltersRef = React.useRef<T | null>(null);
  const debounceTimerRef = React.useRef<number | null>(null);

  // maintain defaults ref
  React.useEffect(() => {
    defaultsRef.current = defaults;
    if (resetOnDefaultsChange) {
      setFilters((prev) =>
        shallowEqual(prev as Record<string, unknown>, defaults as Record<string, unknown>)
          ? prev
          : ({ ...defaults } as T),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultsSignature, resetOnDefaultsChange]);

  // initial state from URL + defaults
  const [filters, setFilters] = React.useState<T>(() =>
    parseFromUrl(new URLSearchParams(paramsString), defaults),
  );

  // URL -> local state (back/forward/manual)
  React.useEffect(() => {
    const parsed = parseFromUrl(new URLSearchParams(paramsString), defaultsRef.current);
    setFilters((prev) =>
      shallowEqual(prev as Record<string, unknown>, parsed as Record<string, unknown>)
        ? prev
        : parsed,
    );
  }, [paramsString]);

  // local state -> URL (debounced per changed keys)
  React.useEffect(() => {
    const prev = prevFiltersRef.current;
    const next = filters;
    prevFiltersRef.current = next;

    // skip first run (initial mount)
    if (prev === null) return;

    const changedKeys = (Object.keys(next) as Array<keyof T>).filter(
      (k) => prev[k] !== next[k],
    );
    if (changedKeys.length === 0) return;

    const debouncedSet = new Set<keyof T>(debouncedKeys);
    const onlyDebouncedChanged = changedKeys.every((k) => debouncedSet.has(k));

    const runUpdate = () => {
      const currentUrl = paramsString ? `${pathname}?${paramsString}` : pathname;
      const nextUrl = buildUrl(
        pathname,
        new URLSearchParams(paramsString),
        defaultsRef.current,
        next,
      );

      if (nextUrl !== currentUrl) {
        if (method === "replace") router.replace(nextUrl, { scroll: false });
        else router.push(nextUrl, { scroll: false });
      }

      onChange?.(next);
    };

    // clear previous timer if any
    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    if (onlyDebouncedChanged) {
      debounceTimerRef.current = window.setTimeout(runUpdate, debounceMs);
      return () => {
        if (debounceTimerRef.current !== null) {
          window.clearTimeout(debounceTimerRef.current);
          debounceTimerRef.current = null;
        }
      };
    }

    // if any immediate key changed, update now
    runUpdate();

    return undefined;
  }, [filters, debouncedKeys, debounceMs, method, onChange, pathname, router, paramsString]);

  const setFilter = React.useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFilters((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }));
  }, []);

  const resetFilters = React.useCallback(() => {
    setFilters((prev) =>
      shallowEqual(prev as Record<string, unknown>, defaultsRef.current as Record<string, unknown>)
        ? prev
        : ({ ...defaultsRef.current } as T),
    );
  }, []);

  return { filters, setFilter, setFilters, resetFilters };
}
