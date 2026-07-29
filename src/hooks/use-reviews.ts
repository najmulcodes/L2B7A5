"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { ApiSuccess, Review } from "@/types";
import type { ReviewFormValues } from "@/lib/validations/rental";

export function useGearReviews(gearItemId: string) {
  return useQuery({
    queryKey: queryKeys.reviews.forGear(gearItemId),
    queryFn: async () => {
      const res = await api.get<ApiSuccess<Review[]>>(`/reviews?gearItemId=${gearItemId}`, {
        skipAuth: true,
      });
      return res.data ?? [];
    },
    enabled: !!gearItemId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      gearItemId,
      rentalOrderId,
      values,
    }: {
      gearItemId: string;
      rentalOrderId: string;
      values: ReviewFormValues;
    }) =>
      api.post<ApiSuccess<Review>>("/reviews", {
        gearItemId,
        rentalOrderId,
        rating: values.rating,
        comment: values.comment || undefined,
      }),
    onSuccess: () => {
      toast.success("Review submitted - thank you!");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["gear"] });
    },
  });
}
