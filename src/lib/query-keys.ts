export const queryKeys = {
  categories: {
    all: ["categories"] as const,
    detail: (id: string) => ["categories", id] as const,
  },
  gear: {
    all: (filters?: Record<string, unknown>) => ["gear", filters] as const,
    detail: (id: string) => ["gear", "detail", id] as const,
    mine: (filters?: Record<string, unknown>) => ["gear", "mine", filters] as const,
  },
  rentals: {
    mine: (filters?: Record<string, unknown>) => ["rentals", "mine", filters] as const,
    detail: (id: string) => ["rentals", "detail", id] as const,
    providerOrders: (filters?: Record<string, unknown>) =>
      ["rentals", "provider", filters] as const,
  },
  payments: {
    mine: (filters?: Record<string, unknown>) => ["payments", "mine", filters] as const,
    detail: (id: string) => ["payments", "detail", id] as const,
  },
  reviews: {
    forGear: (gearItemId: string) => ["reviews", gearItemId] as const,
  },
  auth: {
    me: ["auth", "me"] as const,
  },
  admin: {
    users: (filters?: Record<string, unknown>) => ["admin", "users", filters] as const,
    gear: (filters?: Record<string, unknown>) => ["admin", "gear", filters] as const,
    rentals: (filters?: Record<string, unknown>) => ["admin", "rentals", filters] as const,
  },
};
