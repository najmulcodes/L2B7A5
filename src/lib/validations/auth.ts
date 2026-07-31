import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
    email: z.email("Enter a valid email address"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    phone: z
      .string()
      .trim()
      .min(6, "Enter a valid phone number")
      .max(20)
      .optional()
      .or(z.literal("")),
    role: z.enum(["CUSTOMER", "PROVIDER"], { error: "Please select a role" }),
    businessName: z.string().trim().max(150).optional().or(z.literal("")),
    address: z.string().trim().max(255).optional().or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.role !== "PROVIDER" || !!data.businessName, {
    error: "Business name is required for providers",
    path: ["businessName"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
