# Submission Checklist

Maps every requirement from the assignment spec (`2-GearUp-Frontend.md`) to where it's satisfied in this codebase.

## Roles & Permissions

| Requirement | Status | Where |
|---|---|---|
| Role selected at registration | Yes | `src/app/auth/register/page.tsx` - toggle between CUSTOMER/PROVIDER |
| UI adapts to authenticated role | Yes | `src/components/layout/navbar.tsx`, `src/components/layout/dashboard-sidebar.tsx` - both read role from the Zustand auth store |
| Routes protected via Next.js Middleware | Yes | `src/proxy.ts` (Next.js 16 renamed `middleware.ts` -> `proxy.ts`) - guards `/dashboard/*` by role and `/auth/*` for already-authenticated users |

## Public Features

| Requirement | Status | Where |
|---|---|---|
| Responsive gear grid with `next/image` | Yes | `src/components/gear/gear-card.tsx`, grid layouts throughout use responsive Tailwind classes |
| Advanced search & filter (category, price, brand/location, availability) | Yes | `src/components/gear/gear-browse-client.tsx` - URL-param-driven, shareable/bookmarkable |
| Gear details: gallery, specs, provider info, rent CTA with dates | Yes | `src/components/gear/gear-detail-client.tsx` |
| Skeleton loaders | Yes | `GearCardSkeleton`, route-level `loading.tsx` for `/gear`, `/gear/[id]`, `/dashboard` |
| `error.tsx` fallbacks | Yes | `src/app/global-error.tsx` (root), `src/app/dashboard/error.tsx` (scoped) |

## Customer Features

| Requirement | Status | Where |
|---|---|---|
| Registration/login with Zod + inline errors | Yes | `src/lib/validations/auth.ts`, `src/app/auth/*` |
| Rental checkout UI (dates, items) | Yes | Rent form on the gear detail page, live total calculator |
| Payment redirect to gateway | Yes | `useCreatePayment` -> `window.location.href = paymentUrl` (SSLCommerz - see README for why not Stripe) |
| Dedicated success/cancel pages | Yes | `/payment/status`, reached via `route.ts` handlers at `/payment/{success,fail,cancel}` - see README for why POST-receiving route handlers are needed instead of plain pages |
| Order history with status badges | Yes | `src/app/dashboard/customer/orders/page.tsx` |
| Payment history table | Yes | `src/app/dashboard/customer/payments/page.tsx` |
| Review form after return | Yes | `src/components/reviews/review-modal.tsx`, surfaced from the order detail page when `status === RETURNED` |

## Provider Features

| Requirement | Status | Where |
|---|---|---|
| Dashboard overview (gear/orders/pending counts) | Yes | `src/app/dashboard/provider/page.tsx` |
| Gear CRUD with image URL inputs, pricing, stock | Yes | `src/components/gear/gear-form.tsx` (shared by new/edit), `useFieldArray` for the images list |
| Order management table with status actions | Yes | `src/app/dashboard/provider/orders/`, single contextual action button (Confirm / Mark Picked Up / Mark Returned) matching the backend's exact state machine |

## Admin Features

| Requirement | Status | Where |
|---|---|---|
| Global platform stats | Yes | `src/app/dashboard/admin/page.tsx` |
| User management: search, pagination, suspend/activate | Yes | `src/app/dashboard/admin/users/page.tsx` |
| Gear listings moderation view | Yes | `src/app/dashboard/admin/gear/page.tsx` |
| Rental orders moderation view | Yes | `src/app/dashboard/admin/rentals/page.tsx`, includes force-cancel with required reason |

## UI Focus Details

| Requirement | Status | Notes |
|---|---|---|
| Date pickers block past dates | Yes | `min` attribute on start/end date inputs |
| Date pickers block end-before-start | Yes | Both the `min` attribute and a Zod `.refine()` in `rentSchema` |
| Overlapping-date availability conflicts | Not implemented | Same documented simplification as the backend: inventory is a quantity counter, not a date-range calendar. See README -> Known simplifications |
| Toast notifications for order placement / status updates | Yes | Sonner, wired into every mutation's `onSuccess`/`onError` |
| React Query cache invalidation on status change (vs. optimistic UI + full reload) | Yes | Every mutation hook invalidates the relevant query keys - the orders table reflects a status change without a page reload |
| Status badge colors matching the spec exactly | Yes | `src/components/shared/status-badge.tsx` - PLACED=warning, CONFIRMED=info, PAID=purple, PICKED_UP=success, RETURNED=neutral, CANCELLED=error |

## Route mapping vs. the spec's suggested table

| Spec's suggested route | What this app does | Why |
|---|---|---|
| `/dashboard/customer/orders/[id]/pay` | Payment initiated via a "Pay Now" button directly on `/dashboard/customer/orders/[id]` | One less click/page for a single-purpose action (create a payment session and immediately redirect to the gateway) - the spec explicitly allows adapting suggested routes to the implementation |
| All other routes | Match the spec's table exactly | - |

## Known deviations, documented in README

- No SSR data fetching (client-side TanStack Query throughout) - README -> Architecture -> Data fetching
- Editing a deactivated gear listing isn't supported from the UI - README -> Known simplifications
- Could not live-test against the real deployed backend from the build sandbox (network egress restricted to a fixed allowlist) - verified via `tsc`/`eslint`/`next build` instead, with response shapes cross-referenced directly against the backend's actual code
