"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  fetchCustomers,
  type Customer,
  type CustomerListParams,
} from "@/app/service/customer/CustomerService";
import { deleteCustomerAction } from "@/app/serverAction/customerAction";
import { toast } from "sonner";
import { DEFAULT_FILTERS } from "../constants";

export function useCustomers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<CustomerListParams>(DEFAULT_FILTERS);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadCustomers = useCallback(async () => {
    if (!session?.accessToken) return;
    setLoading(true);
    try {
      const result = await fetchCustomers(
        filters,
        session.accessToken as string
      );
      setCustomers(result.customers);
      setTotalPages(result.totalPages);
      setTotalItems(result.totalItems ?? 0);
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken, filters]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && session?.accessToken) {
      loadCustomers();
    }
  }, [status, session?.accessToken, filters, loadCustomers, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, page: 0 }));
  };

  const handleResetFilters = () => {
    setFilters({ ...DEFAULT_FILTERS });
  };

  const handleDelete = async () => {
    if (!deletingCustomer) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const result = await deleteCustomerAction(deletingCustomer.id);
      if (result.success) {
        setDeletingCustomer(null);
        loadCustomers();
        toast.success("Customer deleted successfully");
      } else {
        setDeleteError(result.error);
        toast.error(result.error);
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  return {
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
    deleteError,
    loadCustomers,
    handleSearch,
    handleResetFilters,
    handleDelete,
    formatDate,
  };
}
