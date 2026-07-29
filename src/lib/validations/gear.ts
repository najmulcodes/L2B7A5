import { z } from "zod";

export const gearConditions = ["NEW", "LIKE_NEW", "GOOD", "FAIR"] as const;

export const gearFormSchema = z.object({
  categoryId: z.string().min(1, "Please select a category"),
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(150),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(3000),
  brand: z.string().trim().max(100).optional().or(z.literal("")),
  images: z
    .array(z.object({ value: z.url("Enter a valid image URL") }))
    .min(1, "Add at least one image URL")
    .max(10, "Up to 10 images allowed"),
  pricePerDay: z.coerce.number().positive("Price must be greater than 0"),
  securityDeposit: z.coerce.number().min(0, "Deposit cannot be negative"),
  quantityTotal: z.coerce.number().int().positive("Quantity must be at least 1"),
  condition: z.enum(gearConditions),
  location: z.string().trim().min(2, "Location is required").max(150),
});

export type GearFormValues = z.infer<typeof gearFormSchema>;
