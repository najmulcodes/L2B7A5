"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import type { z } from "zod";
import { gearFormSchema, gearConditions, type GearFormValues } from "@/lib/validations/gear";
import { useCategories } from "@/hooks/use-categories";
import { FormField } from "@/components/shared/form-field";

type GearFormInput = z.input<typeof gearFormSchema>;

export function GearForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
}: {
  defaultValues?: Partial<GearFormInput>;
  onSubmit: (values: GearFormValues) => void;
  isSubmitting: boolean;
  submitLabel: string;
}) {
  const { data: categories } = useCategories();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GearFormInput, unknown, GearFormValues>({
    resolver: zodResolver(gearFormSchema),
    defaultValues: {
      condition: "GOOD",
      images: [{ value: "" }],
      securityDeposit: 0,
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "images" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 max-w-2xl" noValidate>
      <FormField label="Category" htmlFor="categoryId" error={errors.categoryId?.message}>
        <select id="categoryId" className="select select-bordered w-full" {...register("categoryId")}>
          <option value="">Select a category</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Name" htmlFor="name" error={errors.name?.message}>
        <input id="name" className="input input-bordered w-full" {...register("name")} />
      </FormField>

      <FormField label="Description" htmlFor="description" error={errors.description?.message}>
        <textarea
          id="description"
          rows={4}
          className="textarea textarea-bordered w-full"
          {...register("description")}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Brand (optional)" htmlFor="brand" error={errors.brand?.message}>
          <input id="brand" className="input input-bordered w-full" {...register("brand")} />
        </FormField>
        <FormField label="Condition" htmlFor="condition" error={errors.condition?.message}>
          <select id="condition" className="select select-bordered w-full" {...register("condition")}>
            {gearConditions.map((c) => (
              <option key={c} value={c}>
                {c.replace("_", " ")}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <FormField label="Price/day (৳)" htmlFor="pricePerDay" error={errors.pricePerDay?.message}>
          <input
            id="pricePerDay"
            type="number"
            min={0}
            step="0.01"
            className="input input-bordered w-full"
            {...register("pricePerDay")}
          />
        </FormField>
        <FormField
          label="Deposit (৳)"
          htmlFor="securityDeposit"
          error={errors.securityDeposit?.message}
        >
          <input
            id="securityDeposit"
            type="number"
            min={0}
            step="0.01"
            className="input input-bordered w-full"
            {...register("securityDeposit")}
          />
        </FormField>
        <FormField label="Quantity" htmlFor="quantityTotal" error={errors.quantityTotal?.message}>
          <input
            id="quantityTotal"
            type="number"
            min={1}
            className="input input-bordered w-full"
            {...register("quantityTotal")}
          />
        </FormField>
      </div>

      <FormField label="Location" htmlFor="location" error={errors.location?.message}>
        <input id="location" className="input input-bordered w-full" {...register("location")} />
      </FormField>

      <div className="fieldset">
        <label className="fieldset-legend text-sm font-medium">Image URLs</label>
        <div className="flex flex-col gap-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <div className="flex-1">
                <input
                  className="input input-bordered w-full"
                  placeholder="https://..."
                  {...register(`images.${index}.value` as const)}
                />
                {errors.images?.[index]?.value && (
                  <p className="text-xs text-error mt-1">{errors.images[index]?.value?.message}</p>
                )}
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-square"
                onClick={() => remove(index)}
                disabled={fields.length <= 1}
                aria-label="Remove image"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
        {errors.images?.message && <p className="text-xs text-error mt-1">{errors.images.message}</p>}
        <button
          type="button"
          className="btn btn-outline btn-sm w-fit mt-2"
          onClick={() => append({ value: "" })}
        >
          <Plus className="size-4" /> Add image
        </button>
      </div>

      <button type="submit" className="btn btn-primary mt-2 w-fit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        {submitLabel}
      </button>
    </form>
  );
}
