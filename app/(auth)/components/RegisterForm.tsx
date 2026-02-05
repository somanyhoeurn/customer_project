"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Check } from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
        setSubmitError(result.status?.message ?? result.error);
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
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-48 -right-40 h-[34rem] w-[34rem] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-muted/20" />
      </div>

      <div className="mx-auto grid min-h-screen w-full max-w-6xl items-center px-4 py-10 md:grid-cols-2 md:gap-12">
        <div className="hidden md:block">
          <div className="space-y-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur">
              Create account
            </div>
            <div className="space-y-3">
              <h1 className="text-balance text-4xl font-semibold tracking-tight">
                Get started
              </h1>
              <p className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
                Create an account to access the customer management dashboard.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md border bg-background/70 shadow-xl shadow-black/5 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <CardHeader className="space-y-3">
              <div className="space-y-1">
                <CardTitle className="text-2xl tracking-tight">
                  Create an account
                </CardTitle>
                <CardDescription>
                  Enter your details to get started
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {submitError && (
                    <Alert variant="destructive">
                      <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
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
                              className="h-11"
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
                              className="h-11"
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
                          <div className="space-y-1">
                            <FormLabel>Roles</FormLabel>
                            <FormMessage />
                          </div>
                          <FormControl>
                            <div className="rounded-xl border bg-background/40 p-2 shadow-sm">
                              <ToggleGroup
                                type="multiple"
                                variant="outline"
                                size="lg"
                                className="flex w-full flex-col gap-2"
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                {ROLE_OPTIONS_LIST.map((role) => (
                                  <ToggleGroupItem
                                    key={role}
                                    value={role}
                                    className="group relative h-20 w-full justify-start rounded-2xl border border-border/70 bg-background/60 px-4 text-left shadow-none transition-colors hover:bg-muted/30 data-[state=on]:border-border data-[state=on]:bg-background"
                                  >
                                    <div className="flex w-full items-center gap-4">
                                      <div className="min-w-0 flex-1">
                                        <div className="truncate text-base font-semibold tracking-tight">
                                          {role.replace(/_/g, " ")}
                                        </div>
                                        <div className="truncate text-xs text-muted-foreground">
                                          {role === "CUSTOMER_READ"
                                            ? "View customer data"
                                            : role === "CUSTOMER_WRITE"
                                              ? "Create, edit, and delete customers"
                                              : "Select role"}
                                        </div>
                                      </div>

                                      <div className="ml-auto flex items-center justify-center">
                                        <div className="relative flex size-6 items-center justify-center rounded-md border border-muted-foreground/40 bg-background transition-colors group-data-[state=on]:border-foreground group-data-[state=on]:bg-foreground">
                                          <Check className="size-4 text-background opacity-0 transition-opacity group-data-[state=on]:opacity-100" />
                                        </div>
                                      </div>
                                    </div>
                                  </ToggleGroupItem>
                                ))}
                              </ToggleGroup>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="h-11 w-full"
                    disabled={isLoading}
                  >
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
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
