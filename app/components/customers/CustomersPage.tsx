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
import { Users, Plus } from "lucide-react";
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
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const canWrite = canWriteCustomers(session?.user?.roles);

  return (
    <div className="space-y-6">
      <DashboardHeader />
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 mt-15">
          {/* <Users className="size-8" /> */}
          Customers
        </h1>
        <p className="text-muted-foreground mt-1">
          View and manage customer data
        </p>
      </div>

      <CustomerFilters
        filters={filters}
        onFiltersChange={setFilters}
        onSearch={handleSearch}
        onReset={handleResetFilters}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Customer List</CardTitle>
            <CardDescription>
              {customers.length} customer{customers.length !== 1 ? "s" : ""}{" "}
              found
            </CardDescription>
          </div>
          {canWrite && (
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 size-4" />
              Create Customer
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground py-8 text-center">
              Loading customers...
            </p>
          ) : customers.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              No customers found
            </p>
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
