import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const ROLE_OPTIONS = ["CUSTOMER_READ", "CUSTOMER_WRITE"] as const;

export const registerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roles: z
    .array(z.enum(ROLE_OPTIONS))
    .min(1, "Please select at least one role"),
});

export const ROLE_OPTIONS_LIST = [...ROLE_OPTIONS];

export type LoginFormValues = z.output<typeof loginSchema>;
export type RegisterFormValues = z.output<typeof registerSchema>;
