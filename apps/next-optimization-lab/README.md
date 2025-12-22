# Next.js Optimization Lab

An educational Next.js App Router project demonstrating **data-fetching** and **performance optimizations**. Each route focuses on ONE technique with clear explanations, code examples, and real-time metrics.

## Getting Started

```bash
# Install dependencies
pnpm install

# Start the dev server
pnpm dev
```

Open [http://localhost:3010](http://localhost:3010)

## Labs Overview

### 1. SSR Baseline (`/lab/ssr-baseline`)

- Dynamic fetch using `cache: "no-store"`
- Intentionally unoptimized baseline for comparison
- Shows full TTFB impact of uncached requests

### 2. Fetch Caching (`/lab/fetch-caching`)

- Time-based revalidation with `next: { revalidate: 30 }`
- Stale-while-revalidate pattern
- Shows how data stays cached between requests

### 3. Tags Invalidation (`/lab/tags-invalidation`)

- On-demand cache invalidation with `revalidateTag()`
- Server Action for manual cache purging
- Perfect for post-mutation cache updates

### 4. Parallel vs Waterfall (`/lab/parallel-vs-waterfall`)

- Side-by-side comparison of sequential awaits vs `Promise.all`
- Real timing metrics showing performance difference
- Critical interview topic!

### 5. Suspense Streaming (`/lab/suspense-streaming`)

- Progressive rendering with `<Suspense>` boundaries
- Shell renders immediately, slow data streams in
- Multiple components loading at different speeds

### 6. Dedupe with cache() (`/lab/dedupe-cache`)

- React's `cache()` for request-level deduplication
- Multiple components call same function, executes once
- Avoids prop drilling in Server Components

### 7. Partial Rendering (`/lab/partial-rendering`)

- Above-the-fold content loads fast (no Suspense)
- Below-the-fold content streams later
- Improves Core Web Vitals (LCP)

### 8. Client Cache (`/lab/client-cache`)

- Client-side SWR pattern demonstration
- Stale-while-revalidate in the browser
- Optimistic updates example

### 9. Dashboard (`/dashboard`)

- Mock authenticated page
- Shows how `cookies()` forces dynamic rendering
- Patterns for isolating auth from cacheable content

## Project Structure

```
next-optimization-lab/
├── app/
│   ├── api/products/route.ts     # Mock API endpoint
│   ├── dashboard/page.tsx        # Auth demo
│   ├── lab/
│   │   ├── ssr-baseline/
│   │   ├── fetch-caching/
│   │   ├── tags-invalidation/
│   │   ├── parallel-vs-waterfall/
│   │   ├── suspense-streaming/
│   │   ├── dedupe-cache/
│   │   ├── partial-rendering/
│   │   └── client-cache/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── lab-shell.tsx             # Page wrapper with explanations
│   ├── metrics-panel.tsx         # Performance metrics display
│   ├── product-list.tsx          # Product display component
│   └── skeleton.tsx              # Loading skeletons
└── lib/
    ├── cache.ts                  # React cache() wrappers
    ├── db.ts                     # Mock database layer
    ├── products.ts               # Fetch strategies
    ├── timing.ts                 # Timing utilities
    └── types.ts                  # TypeScript types
```

## Key Concepts

### Next.js Cache Hierarchy

1. **Request Memoization** - React's `cache()` dedupes within a request
2. **Data Cache** - `fetch()` responses cached on server
3. **Full Route Cache** - Entire route cached at build time
4. **Router Cache** - Client-side navigation cache

### When to Use What

| Scenario                           | Strategy                |
| ---------------------------------- | ----------------------- |
| Static content                     | `force-cache` (default) |
| Occasionally updated               | `revalidate: 60`        |
| After mutations                    | `revalidateTag()`       |
| Real-time data                     | `cache: 'no-store'`     |
| Multiple components need same data | React `cache()`         |
| Interactive features               | Client-side SWR         |

## Interview Talking Points

1. **RSC vs Client Components**: Server Components fetch data on server, zero client JS. Client Components hydrate for interactivity.

2. **Static vs Dynamic**: Using `cookies()`, `headers()`, or `cache: 'no-store'` makes a route dynamic.

3. **Streaming**: Suspense boundaries enable progressive HTML streaming for better perceived performance.

4. **Parallel Fetching**: Always use `Promise.all()` for independent data fetches.

## Technologies

- Next.js 16 App Router
- TypeScript
- Server Components (default)
- Server Actions
- React Suspense
- Extended Fetch API
