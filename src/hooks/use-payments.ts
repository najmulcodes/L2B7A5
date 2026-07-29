"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { toQueryString } from "@/lib/query-string";
import { queryKeys } from "@/lib/query-keys";
import type { ApiSuccess, Payment, PaymentStatus } from "@/types";

interface PaymentFilters {
  status?: PaymentStatus;
  page?: number;
  limit?: number;
}

export function useMyPayments(filters: PaymentFilters = {}) {
  return useQuery({
    queryKey: queryKeys.payments.mine(filters),
    queryFn: async () => {
      const res = await api.get<ApiSuccess<Payment[]>>(`/payments${toQueryString(filters)}`);
      return { items: res.data ?? [], meta: res.meta };
    },
  });
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: (rentalOrderId: string) =>
      api.post<ApiSuccess<{ paymentUrl: string; transactionId: string }>>("/payments/create", {
        rentalOrderId,
      }),
  });
}

export function useConfirmPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transactionId: string) =>
      api.post<ApiSuccess<Payment>>("/payments/confirm", { transactionId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}
