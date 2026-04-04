# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (localhost:3000)
npm run build      # Production build
npx tsc --noEmit   # Type-check without building
npm run lint       # ESLint
```

No test suite is configured.

## Architecture

Next.js 14 App Router e-commerce store. TypeScript, Tailwind CSS, Supabase (Postgres + Storage), Stripe hosted checkout, Zustand cart.

### Data flow

- **Server Components** (`app/page.tsx`, `app/shop/page.tsx`, `app/shop/[slug]/page.tsx`, all `app/admin/**` pages) fetch directly from Supabase using `createServerClient()` (anon key, respects RLS).
- **API routes** (`app/api/**`) use `createServiceClient()` (service role key, bypasses RLS) — only import this server-side.
- **Cart state** lives entirely in the browser via Zustand (`lib/cart-store.ts`), persisted to `localStorage` under the key `cart`. Never fetch cart from server.
- **Shop filters** (category, sort) are stored in URL `searchParams`, not component state — the server component reads them directly to build the Supabase query.

### Auth (admin)

`middleware.ts` guards all `/admin/*` and `/api/admin/*` routes by checking the `admin_session` cookie. The cookie value is `HMAC-SHA256(ADMIN_PASSWORD, ADMIN_COOKIE_SECRET)` — stateless, no DB lookup. Set via `POST /api/admin/login`. The `/admin/login` page and its API route are explicitly excluded from the guard.

### Stripe

`POST /api/checkout` creates a Stripe hosted checkout session using `price_data` inline (no pre-created Stripe products). Cart items are embedded in `session.metadata.items` as JSON so the webhook can reconstruct the order.

`POST /api/webhook` must read the raw body with `req.text()` before passing to `stripe.webhooks.constructEvent` — Next.js body parsing would break signature verification. The route exports `export const dynamic = "force-dynamic"`. Orders are upserted on `stripe_session_id` to handle Stripe's at-least-once delivery.

### Supabase clients

| Import | Key used | Use for |
|---|---|---|
| `createServerClient()` from `lib/supabase/server.ts` | anon | Server Components, read-only public data |
| `createServiceClient()` from `lib/supabase/server.ts` | service role | API routes, webhook, admin mutations |
| `supabase` from `lib/supabase/client.ts` | anon | Browser only (ImageUploader uploads to Storage) |

### Hydration gotcha

`Navbar.tsx` reads the Zustand cart count. It uses a `mounted` state flag (`useEffect(() => setMounted(true), [])`) to avoid SSR/client mismatch — render the cart count only after mount.

### Image storage

Product images are stored in a public Supabase Storage bucket named `product-images`. The `images` column in `products` stores full public URLs. Add new hostnames to `next.config.mjs` → `images.remotePatterns` if the Supabase project URL changes.

## Key env vars

```
NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY   — safe to expose
SUPABASE_SERVICE_ROLE_KEY                                   — server only, never client
STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET                   — server only
NEXT_PUBLIC_WHATSAPP_NUMBER                                 — E.164 without +
ADMIN_PASSWORD / ADMIN_COOKIE_SECRET                        — server only
```

## Path alias

`@/` maps to the repo root (configured in `tsconfig.json`).
