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
import { Search } from "lucide-react";

interface ProjectToolbarProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onReset: () => void;
}

export default function ProjectToolbar({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onReset,
}: ProjectToolbarProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const filtersActive = search.trim() !== "" || status !== "";

  return (
    <div className="mt-4 flex flex-col gap-3 sm:w-fit sm:flex-row sm:items-center">
      <div className="relative w-full sm:w-80 md:w-96">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {isMounted ? (
        <Select value={status} onValueChange={onStatusChange}>
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
      ) : (
        <div className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-muted-foreground sm:w-fit">
          All Status
        </div>
      )}

      {filtersActive && (
        <Button variant="outline" onClick={onReset} className="ml-2">
          Clear
        </Button>
      )}
    </div>
  );
}
