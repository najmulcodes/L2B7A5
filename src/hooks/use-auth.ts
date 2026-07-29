"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useAuthStore } from "@/store/auth-store";
import { getAccessToken } from "@/lib/cookies";
import type { ApiSuccess, User } from "@/types";

interface AuthTokensResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "CUSTOMER" | "PROVIDER";
  businessName?: string;
  address?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

function roleHome(role: User["role"]): string {
  if (role === "ADMIN") return "/dashboard/admin";
  if (role === "PROVIDER") return "/dashboard/provider";
  return "/dashboard/customer";
}

export function useCurrentUser() {
  const setUser = useAuthStore((s) => s.setUser);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const res = await api.get<ApiSuccess<User>>("/auth/me");
      if (res.data) setUser(res.data);
      return res.data as User;
    },
    enabled: isHydrated && !!getAccessToken(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useLogin() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LoginInput) =>
      api.post<ApiSuccess<AuthTokensResponse>>("/auth/login", input, { skipAuth: true }),
    onSuccess: (res) => {
      if (!res.data) return;
      login(res.data.user, res.data.accessToken, res.data.refreshToken);
      queryClient.setQueryData(queryKeys.auth.me, res.data.user);
      toast.success("Logged in successfully");
      router.push(roleHome(res.data.user.role));
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RegisterInput) =>
      api.post<ApiSuccess<AuthTokensResponse>>("/auth/register", input, { skipAuth: true }),
    onSuccess: (res) => {
      if (!res.data) return;
      login(res.data.user, res.data.accessToken, res.data.refreshToken);
      queryClient.setQueryData(queryKeys.auth.me, res.data.user);
      toast.success("Account created successfully");
      router.push(roleHome(res.data.user.role));
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return () => {
    logout();
    queryClient.clear();
    toast.success("Logged out");
    router.push("/auth/login");
  };
}
