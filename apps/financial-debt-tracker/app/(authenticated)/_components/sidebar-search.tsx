"use client";

import { Search } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@repo/design-system/components/ui/sidebar";
import { Label } from "@repo/design-system/components/ui/label";

interface SidebarSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function SidebarSearch({
  placeholder = "Search debts, payments...",
  onSearch,
}: SidebarSearchProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    onSearch?.(query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput
            id="search"
            name="search"
            placeholder={placeholder}
            className="pl-8"
          />
          <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}
