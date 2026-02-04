"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Customer } from "@/app/service/customer/CustomerService";

interface CustomerTableProps {
  customers: Customer[];
  formatDate: (dateStr: string) => string;
  canWrite: boolean;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

function CustomerTableRow({
  customer,
  formatDate,
  canWrite,
  onEdit,
  onDelete,
}: {
  customer: Customer;
  formatDate: (dateStr: string) => string;
  canWrite: boolean;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}) {
  return (
    <TableRow>
      <TableCell>{customer.id}</TableCell>
      <TableCell className="font-medium">{customer.name}</TableCell>
      <TableCell>{customer.email}</TableCell>
      <TableCell>{customer.phone}</TableCell>
      <TableCell>{customer.type}</TableCell>
      <TableCell>{customer.status}</TableCell>
      <TableCell>{formatDate(customer.createdAt)}</TableCell>
      {canWrite && (
        <TableCell className="text-center">
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(customer)}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/50 hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => onDelete(customer)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}

export function CustomerTable({
  customers,
  formatDate,
  canWrite,
  onEdit,
  onDelete,
}: CustomerTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          {canWrite && (
            <TableHead className="w-[180px] text-right">Actions</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <CustomerTableRow
            key={customer.id}
            customer={customer}
            formatDate={formatDate}
            canWrite={canWrite}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  );
}
