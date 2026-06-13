# Project Architecture & Tech Stack

## Tech Stack Overview

Template Next.js modern yang ringan, mudah di-clone, dan 100% nyaman di Vercel, dengan stack berikut:

| Kebutuhan        | Library              |
| ---------------- | -------------------- |
| Framework        | Next.js (App Router) |
| UI               | shadcn/ui            |
| Styling          | Tailwind CSS         |
| Data Fetching    | TanStack Query       |
| Data Table       | TanStack Table       |
| Virtual List     | TanStack Virtual     |
| Form             | React Hook Form      |
| Validation       | Zod                  |
| ORM              | Drizzle ORM          |
| Database         | Neon PostgreSQL      |
| Upload File      | UploadThing          |
| Error Monitoring | Sentry               |

## Data Flow Architecture

```text
Sentry Page (App Router)
       │
       ▼
TanStack Query
       │
       ▼
Server Action / Route Handler
       │
       ▼
Drizzle ORM
       │
       ▼
Neon PostgreSQL
```

## Folder Structure

```text
src/
│
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── forgot-password/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Sidebar + Navbar
│   │   ├── page.tsx            # Dashboard Home
│   │   └── profile/
│   │       └── page.tsx
│   │
│   ├── api/
│   │   ├── auth/
│   │   ├── uploadthing/
│   │   │   └── route.ts
│   │   └── webhook/
│   │       └── route.ts
│   │
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   └── globals.css
│
├── components/
│   ├── ui/                     # shadcn/ui
│   ├── layout/                 # Sidebar, Navbar, Footer
│   ├── forms/                  # Reusable Form
│   └── tables/                 # Reusable TanStack Table
│
├── features/
│   ├── auth/
│   │   ├── actions.ts
│   │   ├── queries.ts
│   │   ├── schema.ts
│   │   └── types.ts
│   │
│   └── dashboard/
│       ├── actions.ts
│       ├── queries.ts
│       └── schema.ts
│
├── lib/
│   ├── auth.ts                 # Better Auth / NextAuth
│   ├── db.ts                   # Drizzle Client
│   ├── uploadthing.ts
│   ├── sentry.ts
│   ├── query-client.ts         # TanStack Query
│   ├── env.ts                  # Zod env validation
│   └── utils.ts                # cn(), formatter, helper
│
├── db/
│   ├── schema.ts
│   ├── relations.ts
│   ├── seed.ts
│   └── migrations/
│
├── providers/
│   └── query-provider.tsx
│
├── types/
│   └── index.ts
│
├── middleware.ts
└── instrumentation.ts          # Sentry  
```

## Root Configuration Files

```text
.
├── public/
├── src/
├── drizzle.config.ts
├── next.config.ts
├── middleware.ts
├── instrumentation.ts
├── components.json          # shadcn/ui
├── package.json
├── tsconfig.json
├── .env.example
└── .env.local
```
