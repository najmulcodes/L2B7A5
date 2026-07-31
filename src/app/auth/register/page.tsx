"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus } from "lucide-react";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth";
import { useRegister } from "@/hooks/use-auth";
import { FormField } from "@/components/shared/form-field";
import { ApiClientError } from "@/lib/api-client";

export default function RegisterPage() {
  const registerAccount = useRegister();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "CUSTOMER" },
  });

  const role = watch("role");

  const onSubmit = (values: RegisterFormValues) => {
    registerAccount.mutate(
      {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        phone: values.phone || undefined,
        businessName: values.businessName || undefined,
        address: values.address || undefined,
      },
      {
        onError: (error) => {
          if (error instanceof ApiClientError) {
            const fieldErrors = error.fieldErrors();
            for (const [field, message] of Object.entries(fieldErrors)) {
              setError(field as keyof RegisterFormValues, { message });
            }
            if (Object.keys(fieldErrors).length === 0) {
              setError("root", { message: error.message });
            }
          }
        },
      },
    );
  };

  return (
    <div className="bg-base-200 flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="card bg-base-100 border-base-300 w-full max-w-md border shadow-xl">
        <div className="card-body">
          <h1 className="text-center text-2xl font-bold">Create your account</h1>
          <p className="text-base-content/60 mb-4 text-center text-sm">
            Rent gear or start listing your own
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2" noValidate>
            <FormField label="I want to" htmlFor="role">
              <div className="join w-full">
                <label className="join-item btn has-checked:btn-primary grow">
                  <input type="radio" value="CUSTOMER" className="hidden" {...register("role")} />
                  Rent gear
                </label>
                <label className="join-item btn has-checked:btn-primary grow">
                  <input type="radio" value="PROVIDER" className="hidden" {...register("role")} />
                  List my gear
                </label>
              </div>
            </FormField>

            <FormField label="Full name" htmlFor="name" error={errors.name?.message}>
              <input
                id="name"
                className="input input-bordered w-full"
                placeholder="Your name"
                {...register("name")}
              />
            </FormField>

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

            <FormField label="Phone" htmlFor="phone" error={errors.phone?.message}>
              <input
                id="phone"
                className="input input-bordered w-full"
                placeholder="01700000000"
                {...register("phone")}
              />
            </FormField>

            {role === "PROVIDER" && (
              <FormField
                label="Business name"
                htmlFor="businessName"
                error={errors.businessName?.message}
              >
                <input
                  id="businessName"
                  className="input input-bordered w-full"
                  placeholder="e.g. Dhaka Adventure Gear"
                  {...register("businessName")}
                />
              </FormField>
            )}

            <FormField label="Address" htmlFor="address" error={errors.address?.message}>
              <input
                id="address"
                className="input input-bordered w-full"
                placeholder="Dhanmondi, Dhaka"
                {...register("address")}
              />
            </FormField>

            <FormField label="Password" htmlFor="password" error={errors.password?.message}>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                className="input input-bordered w-full"
                placeholder="At least 8 characters"
                {...register("password")}
              />
            </FormField>

            <FormField
              label="Confirm password"
              htmlFor="confirmPassword"
              error={errors.confirmPassword?.message}
            >
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className="input input-bordered w-full"
                {...register("confirmPassword")}
              />
            </FormField>

            {errors.root && (
              <div role="alert" className="alert alert-error py-2 text-sm">
                <span>{errors.root.message}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary mt-2"
              disabled={registerAccount.isPending}
            >
              {registerAccount.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <UserPlus className="size-4" />
              )}
              Create account
            </button>
          </form>

          <p className="text-base-content/60 mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="link link-primary font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
