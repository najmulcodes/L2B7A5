export const queryKeys = {
  categories: {
    all: ["categories"] as const,
    detail: (id: string) => ["categories", id] as const,
  },
  gear: {
    all: (filters?: object) => ["gear", filters] as const,
    detail: (id: string) => ["gear", "detail", id] as const,
    mine: (filters?: object) => ["gear", "mine", filters] as const,
  },
  rentals: {
    mine: (filters?: object) => ["rentals", "mine", filters] as const,
    detail: (id: string) => ["rentals", "detail", id] as const,
    providerOrders: (filters?: object) => ["rentals", "provider", filters] as const,
  },
  payments: {
    mine: (filters?: object) => ["payments", "mine", filters] as const,
    detail: (id: string) => ["payments", "detail", id] as const,
  },
  reviews: {
    forGear: (gearItemId: string) => ["reviews", gearItemId] as const,
  },
  auth: {
    me: ["auth", "me"] as const,
  },
  admin: {
    users: (filters?: object) => ["admin", "users", filters] as const,
    gear: (filters?: object) => ["admin", "gear", filters] as const,
    rentals: (filters?: object) => ["admin", "rentals", filters] as const,
  },
};
