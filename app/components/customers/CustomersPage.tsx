"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateCustomerDialog } from "./CreateCustomerDialog";
import { EditCustomerDialog } from "./EditCustomerDialog";
import { CustomerFilters } from "./CustomerFilters";
import { CustomerTable } from "./CustomerTable";
import { CustomerPagination } from "./CustomerPagination";
import { DeleteCustomerDialog } from "./DeleteCustomerDialog";
import { useCustomers } from "./hooks/useCustomers";
import { useState } from "react";
import { Customer } from "@/app/service/customer/CustomerService";
import { canWriteCustomers } from "./constants";
import { DashboardHeader } from "@/app/components/customers/Header";

export function CustomersPage() {
  const router = useRouter();
  const {
    session,
    status,
    customers,
    loading,
    totalPages,
    totalItems,
    filters,
    setFilters,
    deletingCustomer,
    setDeletingCustomer,
    deleteLoading,
    loadCustomers,
    handleSearch,
    handleResetFilters,
    handleDelete,
    formatDate,
  } = useCustomers();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen bg-muted/20">
        <DashboardHeader />
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Card className="border bg-background/70">
              <CardHeader className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-56" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const canWrite = canWriteCustomers(session?.user?.roles);

  return (
    <div className="min-h-screen bg-muted/20">
      <DashboardHeader />
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                {/* <Users className="size-8" /> */}
                Customers
              </h1>
              <p className="text-muted-foreground mt-1">
                View and manage customer data
              </p>
            </div>

            {canWrite && (
              <Button
                onClick={() => setCreateDialogOpen(true)}
                className="h-11"
              >
                <Plus className="mr-2 size-4" />
                Create Customer
              </Button>
            )}
          </div>

          <CustomerFilters
            filters={filters}
            onFiltersChange={setFilters}
            onSearch={handleSearch}
            onReset={handleResetFilters}
          />

          <Card className="border bg-background/70 shadow-sm">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <CardTitle className="text-base">Customer List</CardTitle>
                <CardDescription>
                  {customers.length} customer{customers.length !== 1 ? "s" : ""}{" "}
                  found
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3 py-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : customers.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm font-medium">No customers found</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your filters or search term.
                  </p>
                </div>
              ) : (
                <>
                  <CustomerTable
                    customers={customers}
                    formatDate={formatDate}
                    canWrite={canWrite}
                    onEdit={setEditingCustomer}
                    onDelete={setDeletingCustomer}
                  />
                  <CustomerPagination
                    filters={filters}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {canWrite && (
        <>
          <CreateCustomerDialog
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}
            onSuccess={loadCustomers}
          />

          <EditCustomerDialog
            open={!!editingCustomer}
            onOpenChange={(open) => !open && setEditingCustomer(null)}
            customer={editingCustomer}
            onSuccess={loadCustomers}
          />
        </>
      )}

      {canWrite && (
        <DeleteCustomerDialog
          customer={deletingCustomer}
          open={!!deletingCustomer}
          loading={deleteLoading}
          onOpenChange={(open) => {
            if (!open) setDeletingCustomer(null);
          }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
