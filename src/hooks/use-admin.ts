"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { toQueryString } from "@/lib/query-string";
import { queryKeys } from "@/lib/query-keys";
import type { ApiSuccess, GearItem, RentalOrder, User, UserStatus } from "@/types";

interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function useAdminUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: queryKeys.admin.users(filters),
    queryFn: async () => {
      const res = await api.get<ApiSuccess<User[]>>(`/admin/users${toQueryString(filters)}`);
      return { items: res.data ?? [], meta: res.meta };
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      api.patch<ApiSuccess<User>>(`/admin/users/${id}`, { status }),
    onSuccess: (res) => {
      toast.success(
        `User ${res.data?.status === "ACTIVE" ? "activated" : "suspended"} successfully`,
      );
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useAdminGear(filters: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: queryKeys.admin.gear(filters),
    queryFn: async () => {
      const res = await api.get<ApiSuccess<GearItem[]>>(`/admin/gear${toQueryString(filters)}`);
      return { items: res.data ?? [], meta: res.meta };
    },
  });
}

export function useAdminRentals(filters: { status?: string; page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: queryKeys.admin.rentals(filters),
    queryFn: async () => {
      const res = await api.get<ApiSuccess<RentalOrder[]>>(
        `/admin/rentals${toQueryString(filters)}`,
      );
      return { items: res.data ?? [], meta: res.meta };
    },
  });
}

export function useForceCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, cancelReason }: { id: string; cancelReason: string }) =>
      api.patch<ApiSuccess<RentalOrder>>(`/admin/rentals/${id}/cancel`, { cancelReason }),
    onSuccess: () => {
      toast.success("Order cancelled - refund initiated if a payment was completed");
      queryClient.invalidateQueries({ queryKey: ["admin", "rentals"] });
    },
  });
}
