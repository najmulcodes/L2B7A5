"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { toQueryString } from "@/lib/query-string";
import { queryKeys } from "@/lib/query-keys";
import type { ApiSuccess, GearItem } from "@/types";
import type { GearFormValues } from "@/lib/validations/gear";

export interface GearFilters {
  search?: string;
  categoryId?: string;
  brand?: string;
  location?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  availableOnly?: boolean;
  sortBy?: "price_asc" | "price_desc" | "newest" | "rating";
  page?: number;
  limit?: number;
}

export function useGearList(filters: GearFilters = {}) {
  return useQuery({
    queryKey: queryKeys.gear.all(filters),
    queryFn: async () => {
      const res = await api.get<ApiSuccess<GearItem[]>>(`/gear${toQueryString(filters)}`, {
        skipAuth: true,
      });
      return { items: res.data ?? [], meta: res.meta };
    },
    staleTime: 60 * 1000,
  });
}

export function useGearDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.gear.detail(id),
    queryFn: async () => {
      const res = await api.get<ApiSuccess<GearItem>>(`/gear/${id}`, { skipAuth: true });
      return res.data as GearItem;
    },
    enabled: !!id,
  });
}

export function useMyGear(filters: { status?: string; page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: queryKeys.gear.mine(filters),
    queryFn: async () => {
      const res = await api.get<ApiSuccess<GearItem[]>>(`/provider/gear${toQueryString(filters)}`);
      return { items: res.data ?? [], meta: res.meta };
    },
  });
}

function toGearPayload(values: GearFormValues) {
  return {
    ...values,
    brand: values.brand || undefined,
    images: values.images.map((i) => i.value),
  };
}

export function useCreateGear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: GearFormValues) =>
      api.post<ApiSuccess<GearItem>>("/provider/gear", toGearPayload(values)),
    onSuccess: () => {
      toast.success("Gear listed successfully");
      queryClient.invalidateQueries({ queryKey: ["gear"] });
    },
  });
}

export function useUpdateGear(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: Partial<GearFormValues> & { isActive?: boolean }) => {
      const { images, ...rest } = values;
      return api.put<ApiSuccess<GearItem>>(`/provider/gear/${id}`, {
        ...rest,
        ...(images ? { images: images.map((i) => i.value) } : {}),
      });
    },
    onSuccess: () => {
      toast.success("Gear updated successfully");
      queryClient.invalidateQueries({ queryKey: ["gear"] });
    },
  });
}

export function useDeleteGear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<ApiSuccess<null>>(`/provider/gear/${id}`),
    onSuccess: () => {
      toast.success("Gear removed successfully");
      queryClient.invalidateQueries({ queryKey: ["gear"] });
    },
  });
}
