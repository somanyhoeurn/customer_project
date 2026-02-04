"use client";

import { Button } from "@/components/ui/button";
import type { CustomerListParams } from "@/app/service/customer/CustomerService";

interface CustomerPaginationProps {
  filters: CustomerListParams;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function CustomerPagination({
  filters,
  totalPages,
  totalItems,
  onPageChange,
}: CustomerPaginationProps) {
  const currentPage = filters.page ?? 0;

  if (totalItems <= 10) return null;

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-muted-foreground">
        Page {currentPage + 1} of {totalPages} ({totalItems} total)
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
