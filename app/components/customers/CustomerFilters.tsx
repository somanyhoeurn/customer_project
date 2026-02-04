"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { CustomerListParams } from "@/app/service/customer/CustomerService";
import { TYPE_OPTIONS, STATUS_OPTIONS, SORT_OPTIONS } from "./constants";

interface CustomerFiltersProps {
  filters: CustomerListParams;
  onFiltersChange: (filters: CustomerListParams | ((prev: CustomerListParams) => CustomerListParams)) => void;
  onSearch: (e: React.FormEvent) => void;
  onReset: () => void;
}

export function CustomerFilters({
  filters,
  onFiltersChange,
  onSearch,
  onReset,
}: CustomerFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
        <CardDescription>
          Search and filter customers by type, status, and sort order
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSearch} className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-1.5 block">Search</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={filters.search ?? ""}
                onChange={(e) =>
                  onFiltersChange((f) => ({ ...f, search: e.target.value }))
                }
                className="pl-8"
              />
            </div>
          </div>
          <div className="w-[180px]">
            <label className="text-sm font-medium mb-1.5 block">Type</label>
            <Select
              value={filters.type || "all"}
              onValueChange={(value) =>
                onFiltersChange((f) => ({
                  ...f,
                  type: value === "all" ? "" : value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="-" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">-</SelectItem>
                {TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-[180px]">
            <label className="text-sm font-medium mb-1.5 block">Status</label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) =>
                onFiltersChange((f) => ({
                  ...f,
                  status: value === "all" ? "" : value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="-" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">-</SelectItem>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-[180px]">
            <label className="text-sm font-medium mb-1.5 block">
              customerSort
            </label>
            <Select
              value={filters.customerSort ?? "ASC"}
              onValueChange={(value: "ASC" | "DESC") =>
                onFiltersChange((f) => ({ ...f, customerSort: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <Button type="button" variant="outline" onClick={onReset}>
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
