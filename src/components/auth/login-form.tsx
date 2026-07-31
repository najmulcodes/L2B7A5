"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn } from "lucide-react";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { useLogin } from "@/hooks/use-auth";
import { FormField } from "@/components/shared/form-field";
import { ApiClientError } from "@/lib/api-client";

export function LoginForm() {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values, {
      onError: (error) => {
        if (error instanceof ApiClientError) {
          const fieldErrors = error.fieldErrors();
          for (const [field, message] of Object.entries(fieldErrors)) {
            setError(field as keyof LoginFormValues, { message });
          }
          if (Object.keys(fieldErrors).length === 0) {
            setError("root", { message: error.message });
          }
        }
      },
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <h1 className="text-2xl font-bold text-center">Welcome back</h1>
          <p className="text-center text-base-content/60 text-sm mb-4">
            Log in to your GearUp account
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2" noValidate>
            <FormField label="Email" htmlFor="email" error={errors.email?.message}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="input input-bordered w-full"
                placeholder="you@example.com"
                {...register("email")}
              />
            </FormField>

            <FormField label="Password" htmlFor="password" error={errors.password?.message}>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="input input-bordered w-full"
                placeholder="••••••••"
                {...register("password")}
              />
            </FormField>

            {errors.root && (
              <div role="alert" className="alert alert-error text-sm py-2">
                <span>{errors.root.message}</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary mt-2" disabled={login.isPending}>
              {login.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <LogIn className="size-4" />
              )}
              Log in
            </button>
          </form>

          <p className="text-center text-sm text-base-content/60 mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="link link-primary font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
