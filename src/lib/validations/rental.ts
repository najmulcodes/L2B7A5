import { z } from "zod";

export const rentSchema = z
  .object({
    quantity: z.coerce.number().int().positive("Quantity must be at least 1"),
    startDate: z.string().min(1, "Select a start date"),
    endDate: z.string().min(1, "Select an end date"),
    deliveryAddress: z.string().trim().max(255).optional().or(z.literal("")),
    notes: z.string().trim().max(1000).optional().or(z.literal("")),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    error: "End date must be after the start date",
    path: ["endDate"],
  })
  .refine((data) => new Date(data.startDate) >= new Date(new Date().toDateString()), {
    error: "Start date cannot be in the past",
    path: ["startDate"],
  });

export type RentFormValues = z.infer<typeof rentSchema>;

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Select a rating").max(5),
  comment: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
