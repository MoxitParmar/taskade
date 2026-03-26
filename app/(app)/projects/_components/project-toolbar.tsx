"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
} from "@/components/ui/select";
import { useSmartFilters } from "@/hooks/use-smart-filters";
import { Search } from "lucide-react";

interface ProjectToolbarProps {
  setSearch: (value: string) => void;
  setStatus: (value: string) => void;
}

export default function ProjectToolbar({ setSearch, setStatus }: ProjectToolbarProps) {
  const defaults = React.useMemo(
    () => ({
      search: "",
      status: "",
    }),
    [],
  );

  const { filters, setFilter, resetFilters } = useSmartFilters({
    defaults,
    debouncedKeys: ["search"],
    debounceMs: 350,
    method: "replace",
    onChange: (next) => {
      setSearch(String(next.search ?? ""));
      setStatus(String(next.status ?? ""));
    },
  });

  const search = String(filters.search ?? "");
  const status = String(filters.status ?? "");
  const filtersActive = search.trim() !== "" || status !== "";

  return (
    <div className="mt-4 flex flex-col gap-3 sm:w-fit sm:flex-row sm:items-center">
      <div className="relative w-full sm:w-80 md:w-96">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setFilter("search", e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={status} onValueChange={(value) => setFilter("status", value)}>
        <SelectTrigger className="w-full cursor-pointer sm:w-fit">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="planning">Planning</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="on-hold">On Hold</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      {filtersActive && (
        <Button variant="outline" onClick={resetFilters} className="ml-2">
          Clear
        </Button>
      )}
    </div>
  );
}
