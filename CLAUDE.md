# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project Overview

An invoice/customer management dashboard for a fictional company called "Acme". Built following the [Vercel Next.js App Router course](https://nextjs.org/learn). This is a training project.

---

## Commands

Run from `d:\workspace\FORMATION_NEXT-js\Next-js\Project\nextjs-dashboard\`:

```bash
npm run dev     # Dev server with Turbopack (port 3000)
npm run build   # Production build
npm start       # Start production server
```

No test framework is configured.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js (App Router, latest) |
| Language | TypeScript 5.7 (strict mode) |
| Styling | Tailwind CSS 3.4 + `@tailwindcss/forms` |
| Database | PostgreSQL via `postgres` + `@neondatabase/serverless` |
| Auth | `next-auth` 5.0 beta |
| Validation | `zod` |
| Icons | `@heroicons/react` v2 |
| Fonts | Inter (body), Lusitana (display) via Next.js font optimization |

---

## Architecture

### Folder Structure

```
app/
├── dashboard/
│   ├── (overview)/       # Dashboard home (cards, chart, latest invoices)
│   ├── customers/        # Customers list page
│   ├── invoices/         # Invoice management page
│   ├── settings/         # Settings page (placeholder)
│   └── layout.tsx        # Dashboard shell with SideNav
├── lib/
│   ├── db.ts             # Postgres connection (exports `sql`)
│   ├── data.ts           # All database query functions
│   ├── definitions.ts    # Shared TypeScript types
│   ├── placeholder-data.ts # Seed data
│   └── utils.ts          # Helpers (formatCurrency, generatePagination…)
├── ui/
│   ├── dashboard/        # Dashboard-specific components
│   ├── invoices/         # Invoice form & table components
│   ├── customers/        # Customer table components
│   ├── fonts.ts          # Font definitions
│   ├── login-form.tsx    # Login form (client component)
│   ├── search.tsx        # Search input (client component)
│   ├── skeletons.tsx     # Suspense skeleton loaders
│   └── button.tsx        # Shared button
├── seed/route.ts         # GET /api/seed — populates DB from placeholder data
├── query/route.ts        # GET /api/query — ad-hoc query example
├── layout.tsx            # Root layout
└── page.tsx              # Landing page
```

### Component Model

- **Server components** by default — most `page.tsx` and data-heavy components are `async`.
- **Client components** marked with `'use client'`: `NavLinks`, `Search`, `LoginForm`.
- **Suspense** boundaries wrap async server components; `skeletons.tsx` provides fallbacks.

### Path Alias

`@/*` maps to the project root (configured in `tsconfig.json`).

---

## Database

- **No ORM** — raw SQL via template literals using the `postgres` library.
- Connection configured in [app/lib/db.ts](app/lib/db.ts):
  ```ts
  export const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
  ```
- **Tables:** `users`, `customers`, `invoices`, `revenue`
- **Amounts** are stored in **cents** (integer). Use `formatCurrency()` from `utils.ts` for display.
- Seed the DB by hitting `GET /api/seed` once.

### Key Query Functions (`app/lib/data.ts`)

| Function | Returns |
|----------|---------|
| `fetchRevenue()` | 12-month revenue array |
| `fetchLatestInvoices()` | 5 most recent invoices with customer join |
| `fetchCardData()` | Aggregated dashboard stats |
| `fetchFilteredInvoices(query, page)` | Paginated invoice search |
| `fetchInvoicesPages(query)` | Total page count for pagination |
| `fetchInvoiceById(id)` | Single invoice |
| `fetchCustomers()` | All customers |
| `fetchFilteredCustomers(query)` | Customers with aggregated invoice stats |

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```
POSTGRES_URL=          # Required — Neon serverless Postgres URL
AUTH_SECRET=           # Required — generate with: openssl rand -base64 32
AUTH_URL=http://localhost:3000/api/auth
```

---

## Styling Notes

- Use `clsx` for conditional class composition.
- Tailwind custom tokens: `grid-cols-13`, custom `blue-{400,500,600}`, `shimmer` keyframe animation.
- Global styles in [app/ui/global.css](app/ui/global.css).

---

## Seed / Default User

After seeding (`GET /api/seed`):

| Field | Value |
|-------|-------|
| Email | user@nextmail.com |
| Password | 123456 |
