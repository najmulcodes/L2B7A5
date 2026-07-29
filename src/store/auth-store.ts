import { create } from "zustand";
import type { User } from "@/types";
import {
  setAuthCookies,
  clearAuthCookies,
  getAccessToken,
  decodeAccessToken,
  isTokenExpired,
} from "@/lib/cookies";

interface AuthState {
  user: User | null;
  isHydrated: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isHydrated: false,

  login: (user, accessToken, refreshToken) => {
    setAuthCookies(accessToken, refreshToken);
    set({ user, isHydrated: true });
  },

  logout: () => {
    clearAuthCookies();
    set({ user: null, isHydrated: true });
  },

  setUser: (user) => set({ user }),

  /**
   * Called once on app mount. We don't have a full user object cached
   * anywhere client-side between page loads, so this only recovers enough
   * from the token to render the right nav state immediately; the full
   * profile is then fetched via useCurrentUser() (see hooks/use-auth.ts),
   * which overwrites this with the real record.
   */
  hydrate: () => {
    const token = getAccessToken();
    const decoded = token ? decodeAccessToken(token) : null;
    if (!decoded || isTokenExpired(decoded)) {
      set({ user: null, isHydrated: true });
      return;
    }
    set({
      user: {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
        name: "",
        phone: null,
        status: "ACTIVE",
        avatarUrl: null,
        address: null,
        businessName: null,
        bio: null,
        createdAt: "",
        updatedAt: "",
      },
      isHydrated: true,
    });
  },
}));
