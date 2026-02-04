"use server";

import { auth } from "@/app/lib/auth";
import {
  createCustomer,
  deleteCustomer,
  updateCustomer,
  type CreateCustomerPayload,
  type UpdateCustomerPayload,
} from "@/app/service/customer/CustomerService";

const CUSTOMER_WRITE_ROLE = "CUSTOMER_WRITE";

const hasCustomerWrite = (roles?: string[] | null) =>
  !!roles?.includes(CUSTOMER_WRITE_ROLE);

export type CreateCustomerResult =
  | { success: true }
  | { success: false; error: string };

export async function createCustomerAction(
  payload: CreateCustomerPayload
): Promise<CreateCustomerResult> {
  const session = await auth();
  if (!session?.accessToken) {
    return { success: false, error: "Unauthorized" };
  }
  if (!hasCustomerWrite(session.user?.roles)) {
    return { success: false, error: "Forbidden: CUSTOMER_WRITE role required" };
  }

  try {
    await createCustomer(payload);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create customer",
    };
  }
}

export type UpdateCustomerResult =
  | { success: true }
  | { success: false; error: string };

export async function updateCustomerAction(
  id: number,
  payload: UpdateCustomerPayload
): Promise<UpdateCustomerResult> {
  const session = await auth();
  if (!session?.accessToken) {
    return { success: false, error: "Unauthorized" };
  }
  if (!hasCustomerWrite(session.user?.roles)) {
    return { success: false, error: "Forbidden: CUSTOMER_WRITE role required" };
  }

  try {
    await updateCustomer(id, payload);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update customer",
    };
  }
}

export type DeleteCustomerResult =
  | { success: true }
  | { success: false; error: string };

export async function deleteCustomerAction(
  id: number
): Promise<DeleteCustomerResult> {
  const session = await auth();
  if (!session?.accessToken) {
    return { success: false, error: "Unauthorized" };
  }
  if (!hasCustomerWrite(session.user?.roles)) {
    return { success: false, error: "Forbidden: CUSTOMER_WRITE role required" };
  }

  try {
    await deleteCustomer(id);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete customer",
    };
  }
}
