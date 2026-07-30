"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star, Loader2 } from "lucide-react";
import { reviewSchema } from "@/lib/validations/rental";
import type { ReviewFormValues } from "@/lib/validations/rental";
import type { z } from "zod";
import { useCreateReview } from "@/hooks/use-reviews";
import { ApiClientError } from "@/lib/api-client";
import { toast } from "sonner";

export function ReviewModal({
  gearItemId,
  rentalOrderId,
  onClose,
}: {
  gearItemId: string;
  rentalOrderId: string;
  onClose: () => void;
}) {
  const createReview = useCreateReview();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.input<typeof reviewSchema>, unknown, ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5 },
  });
  const rating = Number(watch("rating")) || 0;

  const onSubmit = (values: ReviewFormValues) => {
    createReview.mutate(
      { gearItemId, rentalOrderId, values },
      {
        onSuccess: onClose,
        onError: (error) => {
          if (error instanceof ApiClientError) toast.error(error.message);
        },
      },
    );
  };

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Leave a review</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 mt-4" noValidate>
          <input type="hidden" {...register("rating")} />
          <div className="flex items-center gap-1 justify-center">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setValue("rating", value)}
                aria-label={`Rate ${value} stars`}
              >
                <Star
                  className={`size-8 ${
                    value <= rating ? "fill-warning text-warning" : "text-base-content/20"
                  }`}
                />
              </button>
            ))}
          </div>
          {errors.rating && (
            <p className="text-xs text-error text-center">{errors.rating.message}</p>
          )}

          <textarea
            className="textarea textarea-bordered w-full"
            rows={3}
            placeholder="Share your experience (optional)"
            {...register("comment")}
          />

          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={createReview.isPending}>
              {createReview.isPending && <Loader2 className="size-4 animate-spin" />}
              Submit Review
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
