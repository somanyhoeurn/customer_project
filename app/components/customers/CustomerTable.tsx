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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    <TableRow className="hover:bg-muted/40">
      <TableCell className="w-[72px] text-muted-foreground">
        {customer.id}
      </TableCell>
      <TableCell className="font-medium">{customer.name}</TableCell>
      <TableCell className="text-muted-foreground">{customer.email}</TableCell>
      <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
      <TableCell>
        <Badge variant="outline">{customer.type}</Badge>
      </TableCell>
      <TableCell>
        <Badge
          variant={customer.status === "ACTIVE" ? "secondary" : "outline"}
          className={
            customer.status === "ACTIVE"
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : ""
          }
        >
          {customer.status}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDate(customer.createdAt)}
      </TableCell>
      {canWrite && (
        <TableCell className="text-center">
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0"
              onClick={() => onEdit(customer)}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 text-destructive border-destructive/50 hover:bg-destructive hover:text-destructive-foreground"
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
    <ScrollArea className="w-full">
      <div className="min-w-[900px]">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/20">
              <TableHead className="text-xs font-semibold text-muted-foreground">
                ID
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">
                Name
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">
                Email
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">
                Phone
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">
                Type
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">
                Created
              </TableHead>
              {canWrite && (
                <TableHead className="w-[140px] text-right text-xs font-semibold text-muted-foreground">
                  Actions
                </TableHead>
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
      </div>
    </ScrollArea>
  );
}
