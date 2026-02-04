"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  registerSchema,
  ROLE_OPTIONS_LIST,
  type RegisterFormValues,
} from "../schemas/auth";
import {
  registerService,
  isValidationError,
} from "@/app/service/auth/RegisterService";

export function RegisterForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      roles: [],
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: RegisterFormValues) => {
    setSubmitError(null);
    form.clearErrors();

    try {
      const result = await registerService({
        username: values.username,
        password: values.password,
        roles: values.roles,
      });
      console.log(result);

      if (result.success) {
        router.push("/login");
        router.refresh();
        return;
      }

      // API returned field-level validation errors (e.g. { username: "username is required" })
      if (isValidationError(result.data)) {
        for (const [field, message] of Object.entries(result.data)) {
          if (field === "username" || field === "password" || field === "roles") {
            form.setError(field as keyof RegisterFormValues, { message });
          }
        }
        setSubmitError(result.status?.message ?? "Invalid request data.");
        return;
      }

      // Network/connection error (e.g., CORS, backend down)
      if ("error" in result && result.error) {
        setSubmitError(result.error);
        return;
      }

      // General API error - use status.message
      setSubmitError(
        result.status?.message ?? "Registration failed. Please try again."
      );
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your details to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {submitError && (
                <Alert variant="destructive">
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username"
                        autoComplete="username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roles"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-2">
                      <FormLabel>Roles</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <div className="flex flex-col gap-3">
                        {ROLE_OPTIONS_LIST.map((role) => (
                          <div
                            key={role}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={role}
                              checked={field.value.includes(role)}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...field.value, role]
                                  : field.value.filter((r) => r !== role);
                                field.onChange(newValue);
                              }}
                            />
                            <label
                              htmlFor={role}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {role.replace(/_/g, " ")}
                            </label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="w-full text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
