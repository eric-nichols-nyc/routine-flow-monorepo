# Rendering Lab

Interactive demonstrations of all Next.js rendering strategies in one project.

## 🚀 Getting Started

```bash
pnpm dev
```

Open [http://localhost:3006](http://localhost:3006) to explore.

## 📚 Rendering Methods Covered

| Page                     | Method                                    | Key Concept                                                  |
| ------------------------ | ----------------------------------------- | ------------------------------------------------------------ |
| `/server-components`     | **Server Components (RSC)**               | Default in App Router. No client JS. Direct database access. |
| `/client-components`     | **Client Components**                     | `'use client'` directive. useState, event handlers.          |
| `/static-generation`     | **Static Generation (SSG)**               | Pre-rendered at build time. `generateStaticParams()`.        |
| `/server-side-rendering` | **Server-Side Rendering (SSR)**           | Fresh on every request. `dynamic = 'force-dynamic'`.         |
| `/incremental-static`    | **Incremental Static Regeneration (ISR)** | Static + revalidation. `revalidate = 60`.                    |
| `/streaming`             | **Streaming with Suspense**               | Progressive rendering. `<Suspense>` boundaries.              |

## 🎯 Learning Objectives

Each demo page includes:

- **Live demonstration** with real timestamps and data
- **Code examples** showing exact implementation
- **Explanation cards** with benefits and trade-offs
- **Interview talking points** for job preparation

## 🔍 How to Use

1. **Compare timestamps** - Refresh pages and observe when render times change
2. **Watch network tab** - See when requests are made
3. **Check page source** - Verify what HTML is sent from server
4. **Read the code** - Each page is self-documenting

## 📖 Quick Reference

```typescript
// Server Component (default)
export default async function Page() { ... }

// Client Component
'use client';
export default function Page() { ... }

// SSR (force fresh on every request)
export const dynamic = 'force-dynamic';

// ISR (revalidate every 60 seconds)
export const revalidate = 60;

// SSG (pre-render specific routes)
export async function generateStaticParams() {
  return [{ slug: 'post-1' }, { slug: 'post-2' }];
}
```

## 🛠 Tech Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- TypeScript
- Lucide Icons
