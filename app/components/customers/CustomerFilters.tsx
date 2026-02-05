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
    <Card className="border bg-background/70 shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-base">Filters</CardTitle>
        <CardDescription>
          Search and filter customers by type, status, and sort order
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={onSearch}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12"
        >
          <div className="lg:col-span-5">
            <label className="mb-1.5 block text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={filters.search ?? ""}
                onChange={(e) =>
                  onFiltersChange((f) => ({ ...f, search: e.target.value }))
                }
                className="h-11 pl-9"
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">Type</label>
            <Select
              value={filters.type || "all"}
              onValueChange={(value) =>
                onFiltersChange((f) => ({
                  ...f,
                  type: value === "all" ? "" : value,
                }))
              }
            >
              <SelectTrigger className="h-11">
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

          <div className="lg:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">Status</label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) =>
                onFiltersChange((f) => ({
                  ...f,
                  status: value === "all" ? "" : value,
                }))
              }
            >
              <SelectTrigger className="h-11">
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

          <div className="lg:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">Sort</label>
            <Select
              value={filters.customerSort ?? "ASC"}
              onValueChange={(value: "ASC" | "DESC") =>
                onFiltersChange((f) => ({ ...f, customerSort: value }))
              }
            >
              <SelectTrigger className="h-11">
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

          <div className="flex items-end justify-end lg:col-span-1">
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              className="h-11 w-full lg:w-auto"
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
