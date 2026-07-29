"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { toQueryString } from "@/lib/query-string";
import { queryKeys } from "@/lib/query-keys";
import type { ApiSuccess, RentalOrder, RentalOrderStatus } from "@/types";
import type { RentFormValues } from "@/lib/validations/rental";

interface OrderFilters {
  status?: RentalOrderStatus;
  page?: number;
  limit?: number;
}

export function useMyRentals(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: queryKeys.rentals.mine(filters),
    queryFn: async () => {
      const res = await api.get<ApiSuccess<RentalOrder[]>>(`/rentals${toQueryString(filters)}`);
      return { items: res.data ?? [], meta: res.meta };
    },
  });
}

export function useRentalDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.rentals.detail(id),
    queryFn: async () => {
      const res = await api.get<ApiSuccess<RentalOrder>>(`/rentals/${id}`);
      return res.data as RentalOrder;
    },
    enabled: !!id,
  });
}

export function useCreateRental(gearItemId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: RentFormValues) =>
      api.post<ApiSuccess<RentalOrder>>("/rentals", {
        items: [{ gearItemId, quantity: values.quantity }],
        startDate: values.startDate,
        endDate: values.endDate,
        deliveryAddress: values.deliveryAddress || undefined,
        notes: values.notes || undefined,
      }),
    onSuccess: () => {
      toast.success("Rental order placed successfully");
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      queryClient.invalidateQueries({ queryKey: ["gear"] });
    },
  });
}

export function useCancelRental() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, cancelReason }: { id: string; cancelReason?: string }) =>
      api.patch<ApiSuccess<RentalOrder>>(`/rentals/${id}/cancel`, { cancelReason }),
    onSuccess: () => {
      toast.success("Order cancelled");
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
    },
  });
}

export function useProviderOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: queryKeys.rentals.providerOrders(filters),
    queryFn: async () => {
      const res = await api.get<ApiSuccess<RentalOrder[]>>(
        `/provider/orders${toQueryString(filters)}`,
      );
      return { items: res.data ?? [], meta: res.meta };
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "CONFIRMED" | "PICKED_UP" | "RETURNED" }) =>
      api.patch<ApiSuccess<RentalOrder>>(`/provider/orders/${id}`, { status }),
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
    },
  });
}
