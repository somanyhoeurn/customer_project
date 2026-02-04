import { API_URL } from "@/app/constants";
import { headerToken } from "@/app/api/auth/HeaderToken";

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerListParams {
  search?: string;
  type?: string;
  status?: string;
  page?: number;
  size?: number;
  customerSort?: "ASC" | "DESC";
}

export interface CustomerListResponse {
  data?:
    | Customer[]
    | {
        items: Customer[];
        page: number;
        size: number;
        totalItems: number;
        totalPages: number;
      }
  status?: {
    code: string;
    message: string;
  };
}

export const fetchCustomers = async (
  params: CustomerListParams,
  accessToken: string
): Promise<
  CustomerListResponse & {
    customers: Customer[];
    totalPages: number;
    totalItems: number;
  }
> => {
  const searchParams = new URLSearchParams();

  if (params.search) searchParams.set("search", params.search);
  if (params.type) searchParams.set("type", params.type);
  if (params.status) searchParams.set("status", params.status);
  searchParams.set("page", String(params.page ?? 0));
  searchParams.set("size", String(params.size ?? 20));
  if (params.customerSort) searchParams.set("customerSort", params.customerSort);

  const res = await fetch(
    `${API_URL}/customers?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        accept: "*/*",
      },
    }
  );

  const data = await res.json();

  let customers: Customer[] = [];
  let totalPages = 1;
  let totalItems = 0;

  if (data?.data) {
    if (Array.isArray(data.data)) {
      customers = data.data;
      totalItems = data.data.length;
    } else if (data.data.items) {
      customers = data.data.items;
      totalPages = data.data.totalPages ?? 1;
      totalItems = data.data.totalItems ?? customers.length;
    } else if (data.data.content) {
      customers = data.data.content;
      totalPages = data.data.totalPages ?? 1;
      totalItems = data.data.totalElements ?? customers.length;
    } else if (data.data.id != null) {
      customers = [data.data as Customer];
      totalItems = 1;
    }
  }

  return { ...data, customers, totalPages, totalItems };
};

export interface CreateCustomerPayload {
  name: string;
  type: "INDIVIDUAL" | "CORPORATE";
  email: string;
  phone: string;
}

export const createCustomer = async (
  payload: CreateCustomerPayload
): Promise<{ data?: Customer; status?: { code: string; message: string } }> => {
    const header = await headerToken();
  const res = await fetch(`${API_URL}/customers`, {
    method: "POST",
    headers: header,
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.status?.message ?? "Failed to create customer");
  }

  return data;
};

export interface UpdateCustomerPayload {
  name: string;
  type: "INDIVIDUAL" | "CORPORATE";
  email: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE";
}

export const updateCustomer = async (
  id: number,
  payload: UpdateCustomerPayload
): Promise<{ data?: Customer; status?: { code: string; message: string } }> => {
  const header = await headerToken();
  const res = await fetch(`${API_URL}/customers/${id}`, {
    method: "PUT",
    headers: header,
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.status?.message ?? "Failed to update customer");
  }

  return data;
};

export const deleteCustomer = async (id: number): Promise<void> => {
  const header = await headerToken();
  const res = await fetch(`${API_URL}/customers/${id}`, {
    method: "DELETE",
    headers: header,
  });

  const data = await res.json().catch(() => ({}));
  const apiMessage =
    data?.status?.message ?? "Failed to delete customer";

  if (!res.ok) {
    throw new Error(apiMessage);
  }

  if (data?.status && data.status.code !== "SUCCESS") {
    throw new Error(apiMessage);
  }
};
