export const TYPE_OPTIONS = [
  { value: "INDIVIDUAL", label: "Individual" },
  { value: "CORPORATE", label: "Corporate" },
] as const;

export const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
] as const;

export const SORT_OPTIONS = [
  { value: "ASC", label: "Ascending" },
  { value: "DESC", label: "Descending" },
] as const;

export const CUSTOMER_WRITE_ROLE = "CUSTOMER_WRITE" as const;

export const canWriteCustomers = (roles?: string[] | null): boolean =>
  !!roles?.includes(CUSTOMER_WRITE_ROLE);

export const DEFAULT_FILTERS = {
  search: "",
  type: "",
  status: "",
  page: 0,
  size: 10,
  customerSort: "ASC" as const,
};
