"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { ApiSuccess, Category } from "@/types";

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: async () => {
      const res = await api.get<ApiSuccess<Category[]>>("/categories", { skipAuth: true });
      return res.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
