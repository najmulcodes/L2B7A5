# GearUp Frontend

Next.js 16 (App Router) frontend for **GearUp**, a sports & outdoor gear rental marketplace. Built for Programming Hero Level 2 Batch 7, Assignment 5 (student ID `L2B7-0384`, GearUp variant). Consumes the [GearUp backend](https://github.com/najmulcodes/L2B7A4) built for Assignment 4.

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript 6 |
| Styling | Tailwind CSS v4 (CSS-first config) + DaisyUI 5 |
| Server state | TanStack Query 5 |
| Forms | React Hook Form 7 + Zod 4 |
| Client state | Zustand (auth store only - everything else is server state via TanStack Query) |
| Toasts | Sonner |

Like the backend, this targets **current** major versions rather than what most tutorials show - Next.js 16, React 19, and Tailwind v4 all shipped real breaking changes that affect this codebase directly (see [Notes on the current stack](#notes-on-the-current-stack)).

## Local setup

```bash
npm install
cp .env.example .env.local   # point NEXT_PUBLIC_API_URL at your backend
npm run dev                   # http://localhost:3000
```

The default `.env.example` value points at the already-deployed backend (`https://l2b7a4.onrender.com/api`), so the app works against real data immediately without needing to also run the backend locally.

```bash
npm run build       # production build
npm start            # run the production build
npm run typecheck    # tsc --noEmit
npm run lint          # eslint
```

## Architecture

### Auth: cookies, not a BFF proxy

The backend issues JWTs (access + refresh) in the response body, not as `Set-Cookie` headers. Rather than standing up a full proxy layer (a Next.js Route Handler mirroring every one of the backend's ~30 endpoints just to keep tokens server-only in httpOnly cookies), tokens are stored in a **regular, client-readable cookie**. This lets both `src/proxy.ts` (route protection) and client-side TanStack Query hooks (calling the backend directly) share one token without a proxy layer per endpoint.

The tradeoff: slightly higher XSS exposure than an httpOnly-cookie architecture. Reasonable for this assignment's scope - worth knowing if this became a production app. `src/proxy.ts` is documented as a UX convenience only; the real authorization boundary is the backend, which independently validates every request regardless of what the frontend's routing does.

### Data fetching

Every data-fetching page is a Client Component using a TanStack Query hook (see `src/hooks/`). This was a deliberate simplification over mixing Server Component SSR fetches with client fetches - it means one consistent auth/caching story instead of building parallel server-side and client-side fetch paths that both need to handle the same cookie.

### Payment flow

SSLCommerz completes a payment by redirecting the customer's **browser via a form POST** (not a GET), so `/payment/success`, `/payment/fail`, and `/payment/cancel` are Route Handlers (`route.ts`), not pages - they extract `tran_id` from the POST body and redirect (303) to `/payment/status?outcome=...&transactionId=...`, which is the actual page that renders UI. That page always re-verifies via `POST /api/payments/confirm` rather than trusting the `outcome` query param, which is just SSLCommerz's own claim carried through an unauthenticated redirect.

**This requires one small backend change** - see below.

## Backend change required

The backend's `success_url`/`fail_url`/`cancel_url` currently point at itself (`${APP_BASE_URL}/api/payments/...`), rendering a static HTML confirmation page. For this frontend's dedicated `/payment/status` page to work, those three URLs need to point at the **frontend** instead (`ipn_url` stays pointed at the backend - it's server-to-server, only the backend can process it).

In `src/modules/payments/sslcommerz.gateway.ts`, on the backend:

```ts
// Before:
success_url: `${callbackBase}/api/payments/success`,
fail_url: `${callbackBase}/api/payments/fail`,
cancel_url: `${callbackBase}/api/payments/cancel`,
ipn_url: `${callbackBase}/api/payments/ipn`,

// After:
success_url: `${env.FRONTEND_URL}/payment/success`,
fail_url: `${env.FRONTEND_URL}/payment/fail`,
cancel_url: `${env.FRONTEND_URL}/payment/cancel`,
ipn_url: `${callbackBase}/api/payments/ipn`,
```

Add a `FRONTEND_URL` environment variable to the backend (e.g. `https://gearup.vercel.app`, no trailing slash) and to its Zod-validated env schema (`src/config/env.ts`) the same way `APP_BASE_URL` is defined. Everything else in the payment flow - the actual gateway verification logic - is unchanged.

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the GearUp backend API, including `/api` (e.g. `https://l2b7a4.onrender.com/api`) |

## Deployment (Vercel)

1. Import the repo in Vercel.
2. Add `NEXT_PUBLIC_API_URL` pointing at the deployed backend.
3. Deploy.
4. Apply the backend change above with `FRONTEND_URL` set to the resulting Vercel URL, and redeploy the backend.

No `vercel.json` is needed - Next.js App Router projects deploy to Vercel zero-config.

## Known simplifications

- **No SSR data fetching.** Every page fetches client-side via TanStack Query rather than mixing in Server Component fetches - see [Data fetching](#data-fetching) above for why.
- **Editing inactive gear isn't supported.** The edit page fetches via the public gear-detail endpoint, which only serves active listings (there's no dedicated `GET /api/provider/gear/:id` on the backend). A provider can still deactivate/reactivate via the update endpoint's `isActive` field; they just can't load an already-inactive item back into the edit form. Same class of scope tradeoff as the backend's documented simplifications.
- **Could not live-test against the real deployed backend from the sandbox this was built in** (network egress is restricted to a fixed allowlist that doesn't include arbitrary deployed URLs). Verified extensively via `tsc`, `eslint`, and `next build` instead, with API response shapes cross-referenced directly against the backend's actual controller/service code. Confirm the full login -> browse -> rent -> pay -> confirm flow end-to-end against the real backend as a first smoke test.

## Notes on the current stack

- **Next.js 16** removed the Pages Router, `next lint`, and Babel entirely, and renamed `middleware.ts` to `proxy.ts` (runs on the Node.js runtime now, not Edge). `params`/`searchParams` are `Promise`s that must be awaited.
- **Tailwind v4** uses CSS-first configuration (`@import "tailwindcss"`, `@theme`, `@plugin`) - there's no `tailwind.config.js` in this project.
- **DaisyUI** was chosen over shadcn/ui: shadcn's CLI needs to reach `ui.shadcn.com`'s registry at scaffold time, which wasn't reachable from the sandbox this was built in. DaisyUI is a pure Tailwind plugin (`@plugin "daisyui"`), no registry fetch required, and is explicitly allowed by the assignment spec.
- **Zod pinning matters.** `eslint-config-next`'s dependency chain pins `zod` to `^3.x` internally; without an explicit top-level `"zod": "^4.4.3"` in `package.json`, npm dedupes the whole project down to Zod 3, silently breaking any v4-only API (`z.email()`, the `{ error: ... }` param, etc.).
