# API Integration Map

Maps every frontend component/page to the backend endpoint(s) it consumes. Backend: GearUp API (Assignment 4), base URL configured via `NEXT_PUBLIC_API_URL`.

## Auth

| Frontend | Backend Endpoint | Purpose |
|---|---|---|
| `src/app/auth/login/page.tsx` -> `useLogin` (`src/hooks/use-auth.ts`) | `POST /auth/login` | Log in, store tokens in cookies |
| `src/app/auth/register/page.tsx` -> `useRegister` | `POST /auth/register` | Create account (CUSTOMER or PROVIDER) |
| `src/lib/api-client.ts` (`refreshAccessToken`, auto-triggered on any 401) | `POST /auth/refresh-token` | Silent token refresh + retry |
| `src/components/layout/navbar.tsx` -> `useCurrentUser` | `GET /auth/me` | Hydrate full user profile after cookie-based auth restore |
| `useLogout` (`src/hooks/use-auth.ts`), used by `navbar.tsx` | *(client-side only - clears cookies)* | Log out |

## Categories

| Frontend | Backend Endpoint | Purpose |
|---|---|---|
| `src/components/gear/home-categories.tsx`, `src/components/gear/gear-browse-client.tsx` -> `useCategories` | `GET /categories` | Category filter chips/dropdown |

## Gear (public)

| Frontend | Backend Endpoint | Purpose |
|---|---|---|
| `src/components/gear/gear-browse-client.tsx`, `home-featured-gear.tsx` -> `useGearList` | `GET /gear` | Browse/search/filter/sort/paginate |
| `src/components/gear/gear-detail-client.tsx` -> `useGearDetail`; also `generateMetadata` in `src/app/gear/[id]/page.tsx` | `GET /gear/:id` | Gear details + reviews for SEO metadata |

## Gear (provider)

| Frontend | Backend Endpoint | Purpose |
|---|---|---|
| `src/app/dashboard/provider/gear/page.tsx` -> `useMyGear` | `GET /provider/gear` | Provider's own listings, active/inactive tabs |
| `src/app/dashboard/provider/gear/new/page.tsx` -> `useCreateGear` | `POST /provider/gear` | Create a listing |
| `src/app/dashboard/provider/gear/[id]/edit/page.tsx` -> `useUpdateGear` | `PUT /provider/gear/:id` | Edit a listing |
| Same page -> `useDeleteGear` | `DELETE /provider/gear/:id` | Remove a listing |

## Rental Orders (customer)

| Frontend | Backend Endpoint | Purpose |
|---|---|---|
| Rent form on `gear-detail-client.tsx` -> `useCreateRental` | `POST /rentals` | Place a rental order |
| `src/app/dashboard/customer/page.tsx`, `orders/page.tsx` -> `useMyRentals` | `GET /rentals` | Order history, status-filtered |
| `src/app/dashboard/customer/orders/[id]/page.tsx` -> `useRentalDetail` | `GET /rentals/:id` | Order detail |
| Same page -> `useCancelRental` | `PATCH /rentals/:id/cancel` | Cancel (while still PLACED) |

## Orders (provider)

| Frontend | Backend Endpoint | Purpose |
|---|---|---|
| `src/app/dashboard/provider/page.tsx`, `orders/page.tsx` -> `useProviderOrders` | `GET /provider/orders` | Incoming orders, status-filtered |
| `src/app/dashboard/provider/orders/[id]/page.tsx` -> `useRentalDetail` | `GET /rentals/:id` | Order detail (shared with customer view - backend authorizes by relationship, not a separate provider-specific detail endpoint) |
| Same page -> `useUpdateOrderStatus` | `PATCH /provider/orders/:id` | Confirm / mark picked up / mark returned |

## Payments

| Frontend | Backend Endpoint | Purpose |
|---|---|---|
| "Pay Now" button on `dashboard/customer/orders/[id]/page.tsx` -> `useCreatePayment` | `POST /payments/create` | Create SSLCommerz session, redirect to `paymentUrl` |
| `src/app/payment/{success,fail,cancel}/route.ts` | *(receives SSLCommerz's POST redirect - no backend call, forwards to `/payment/status`)* | Gateway return handling |
| `src/components/payments/payment-result-client.tsx` -> `useConfirmPayment` | `POST /payments/confirm` | Authoritative re-verification of payment status |
| `src/app/dashboard/customer/payments/page.tsx` -> `useMyPayments` | `GET /payments` | Payment history |

## Reviews

| Frontend | Backend Endpoint | Purpose |
|---|---|---|
| `gear-detail-client.tsx` -> `useGearReviews` | `GET /reviews?gearItemId=` | Reviews shown on a gear listing |
| `src/components/reviews/review-modal.tsx` -> `useCreateReview` | `POST /reviews` | Submit a review (only for a RETURNED order) |

## Admin

| Frontend | Backend Endpoint | Purpose |
|---|---|---|
| `src/app/dashboard/admin/users/page.tsx` -> `useAdminUsers` | `GET /admin/users` | User list, filter by role/status/search |
| Same page -> `useUpdateUserStatus` | `PATCH /admin/users/:id` | Suspend / activate |
| `src/app/dashboard/admin/gear/page.tsx` -> `useAdminGear` | `GET /admin/gear` | Platform-wide gear oversight |
| `src/app/dashboard/admin/rentals/page.tsx` -> `useAdminRentals` | `GET /admin/rentals` | Platform-wide order oversight |
| Same page -> `useForceCancelOrder` | `PATCH /admin/rentals/:id/cancel` | Force-cancel + auto-refund if paid |
| `src/app/dashboard/admin/page.tsx` | `GET /admin/users`, `GET /admin/gear`, `GET /admin/rentals` (each `limit=1`, reading only `meta.total`) | Overview stat cards |

## Not yet wired to a dedicated frontend page

- `PATCH /auth/me` (profile update) and `PATCH /auth/me/password` exist on the backend but have no frontend UI yet - out of scope for this assignment's required pages.
- `PUT /admin/categories/:id`, `DELETE /admin/categories/:id`, `POST /admin/categories` (admin category CRUD) - not required by the frontend spec's page list, not built.