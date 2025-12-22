export type DocPage = {
  slug: string;
  title: string;
  description: string;
  category: string;
  relatedLab?: string;
  content: string;
};

export const docs: DocPage[] = [
  // Overview
  {
    slug: "overview",
    title: "Overview",
    description: "Introduction to the Next.js Optimization Lab",
    category: "Getting Started",
    content: `
# Next.js Optimization Lab

This project is an educational playground for understanding **data-fetching** and **performance optimizations** in the Next.js App Router.

## Philosophy

Each lab demonstrates **ONE optimization technique** in isolation. This makes it easier to understand the impact of each approach without confusing variables.

## Key Concepts

### Server Components (RSC)
React Server Components run exclusively on the server. They can:
- Directly access databases, file systems, and secrets
- Send zero JavaScript to the client for data fetching
- Reduce bundle size dramatically

### The Cache Hierarchy
Next.js has multiple cache layers:
1. **Request Memoization** - Dedupe identical fetch calls in a single render
2. **Data Cache** - Persists fetch results across requests
3. **Full Route Cache** - Caches entire rendered pages (static routes)
4. **Router Cache** - Client-side cache for prefetched routes

### Static vs Dynamic
- **Static**: Generated at build time, served from CDN
- **Dynamic**: Rendered per-request (triggered by cookies, headers, \`cache: 'no-store'\`)

## How to Use This Lab

1. Pick a lab from the sidebar
2. Read the explanation at the top
3. Interact with the demo
4. Check the MetricsPanel for timing data
5. Read the corresponding docs for deeper understanding
    `.trim(),
  },

  // Caching
  {
    slug: "caching",
    title: "Caching Strategies",
    description: "Understanding Next.js caching layers",
    category: "Core Concepts",
    relatedLab: "/lab/fetch-caching",
    content: `
# Caching Strategies

Next.js provides powerful caching at multiple levels. Understanding when and how to use each is crucial for performance.

## The Four Caches

### 1. Request Memoization
Automatic deduplication of identical \`fetch()\` calls within a single render pass.

\`\`\`tsx
// Both calls are deduped - only ONE network request
async function Component1() {
  const data = await fetch('/api/data')
}
async function Component2() {
  const data = await fetch('/api/data') // Uses cached result
}
\`\`\`

### 2. Data Cache
Persists fetch results across requests. Controlled via:
- \`cache: 'force-cache'\` (default) - Cache indefinitely
- \`cache: 'no-store'\` - Never cache
- \`next: { revalidate: 60 }\` - Cache for 60 seconds

\`\`\`tsx
// Cached for 60 seconds
fetch('/api/data', { next: { revalidate: 60 } })

// Never cached
fetch('/api/data', { cache: 'no-store' })
\`\`\`

### 3. Full Route Cache
Static routes are rendered at build time and cached. Dynamic routes opt out.

**Triggers for Dynamic Rendering:**
- Using \`cookies()\` or \`headers()\`
- Using \`searchParams\` in page props
- Using \`cache: 'no-store'\` in any fetch

### 4. Router Cache (Client)
Client-side cache for prefetched and visited routes.
- Prefetched routes: 30 seconds (static) or 5 minutes (dynamic)
- Visited routes: 5 minutes

## When to Use What

| Scenario | Strategy |
|----------|----------|
| Rarely changing data | \`force-cache\` (default) |
| User-specific data | \`no-store\` |
| Updates every few minutes | \`revalidate: 60\` |
| On-demand updates | \`revalidateTag()\` |

## Try It
Check out the [Fetch Caching Lab](/lab/fetch-caching) to see these in action.
    `.trim(),
  },

  // Streaming
  {
    slug: "streaming",
    title: "Streaming & Suspense",
    description: "Progressive rendering with React Suspense",
    category: "Core Concepts",
    relatedLab: "/lab/suspense-streaming",
    content: `
# Streaming & Suspense

Streaming allows you to progressively render UI, showing content to users before the entire page is ready.

## The Problem

Traditional SSR is "all or nothing":
1. Fetch ALL data on server
2. Render ALL components
3. Send complete HTML
4. User sees blank screen until step 3 completes

With slow data sources, TTFB (Time to First Byte) suffers.

## The Solution: Suspense Boundaries

Wrap slow components in \`<Suspense>\`:

\`\`\`tsx
export default function Page() {
  return (
    <div>
      <Header /> {/* Renders immediately */}

      <Suspense fallback={<Skeleton />}>
        <SlowProductList /> {/* Streams in when ready */}
      </Suspense>
    </div>
  )
}
\`\`\`

## How It Works

1. Next.js sends the initial HTML shell immediately
2. \`<Suspense>\` boundaries show their fallback
3. When async components resolve, HTML "chunks" stream to the client
4. React hydrates and replaces fallbacks with real content

## Benefits

- **Faster TTFB**: Users see content immediately
- **Progressive Enhancement**: Critical content first
- **Better UX**: Skeleton states instead of blank screens

## Nested Suspense

You can nest Suspense for fine-grained loading states:

\`\`\`tsx
<Suspense fallback={<PageSkeleton />}>
  <Header />
  <Suspense fallback={<ProductsSkeleton />}>
    <ProductList />
    <Suspense fallback={<ReviewsSkeleton />}>
      <Reviews />
    </Suspense>
  </Suspense>
</Suspense>
\`\`\`

## Try It
See the [Suspense Streaming Lab](/lab/suspense-streaming) for a live demo.
    `.trim(),
  },

  // Parallel Data Fetching
  {
    slug: "parallel-fetching",
    title: "Parallel Data Fetching",
    description: "Avoiding waterfalls with Promise.all",
    category: "Performance Patterns",
    relatedLab: "/lab/parallel-vs-waterfall",
    content: `
# Parallel Data Fetching

Sequential \`await\` statements create "waterfalls" that slow down your page.

## The Waterfall Problem

\`\`\`tsx
// ❌ WATERFALL - Each fetch waits for the previous
async function Page() {
  const user = await getUser()      // 200ms
  const posts = await getPosts()    // 300ms
  const comments = await getComments() // 250ms
  // Total: 750ms
}
\`\`\`

## The Solution: Promise.all

\`\`\`tsx
// ✅ PARALLEL - All fetches start at once
async function Page() {
  const [user, posts, comments] = await Promise.all([
    getUser(),      // 200ms
    getPosts(),     // 300ms
    getComments()   // 250ms
  ])
  // Total: 300ms (longest single request)
}
\`\`\`

## When Dependencies Exist

Sometimes fetches depend on each other:

\`\`\`tsx
async function Page() {
  // Must wait for user first
  const user = await getUser()

  // These can be parallel
  const [posts, followers] = await Promise.all([
    getPostsByUser(user.id),
    getFollowers(user.id)
  ])
}
\`\`\`

## Combined with Suspense

For the best UX, combine parallel fetching with Suspense:

\`\`\`tsx
// Fetch in parallel, stream independently
<Suspense fallback={<UserSkeleton />}>
  <UserProfile /> {/* Fetches user */}
</Suspense>
<Suspense fallback={<PostsSkeleton />}>
  <PostsList /> {/* Fetches posts - parallel! */}
</Suspense>
\`\`\`

## Try It
Compare approaches in the [Parallel vs Waterfall Lab](/lab/parallel-vs-waterfall).
    `.trim(),
  },

  // Revalidation
  {
    slug: "revalidation",
    title: "On-Demand Revalidation",
    description: "Invalidating cache with tags and paths",
    category: "Performance Patterns",
    relatedLab: "/lab/tags-invalidation",
    content: `
# On-Demand Revalidation

When cached data changes, you need to invalidate the cache. Next.js offers two approaches.

## revalidatePath()

Invalidates the cache for a specific route:

\`\`\`tsx
import { revalidatePath } from 'next/cache'

async function updateProduct(id: string) {
  await db.products.update(id, { ... })

  revalidatePath('/products')        // Revalidate list
  revalidatePath(\`/products/\${id}\`) // Revalidate detail
}
\`\`\`

## revalidateTag()

Tag your fetches, then invalidate by tag:

\`\`\`tsx
// Tag the fetch
fetch('/api/products', {
  next: { tags: ['products'] }
})

// Invalidate all fetches with this tag
import { revalidateTag } from 'next/cache'

async function updateProduct() {
  await db.products.update(...)
  revalidateTag('products')
}
\`\`\`

## When to Use Which

| Use Case | Approach |
|----------|----------|
| Single page update | \`revalidatePath()\` |
| Data used across pages | \`revalidateTag()\` |
| CMS webhook | \`revalidateTag()\` |
| After form submission | Either works |

## Server Actions

Combine with Server Actions for seamless UX:

\`\`\`tsx
async function addToCart(productId: string) {
  'use server'

  await db.cart.add(productId)
  revalidateTag('cart')

  // UI updates automatically!
}
\`\`\`

## Try It
See it in action: [Tags & Invalidation Lab](/lab/tags-invalidation).
    `.trim(),
  },

  // React cache()
  {
    slug: "react-cache",
    title: "React cache() Function",
    description: "Request-level memoization for non-fetch data",
    category: "Advanced",
    relatedLab: "/lab/dedupe-cache",
    content: `
# React cache() Function

While \`fetch()\` is automatically deduplicated, other data sources need manual memoization.

## The Problem

\`\`\`tsx
// ❌ Called twice = two DB queries
async function Header() {
  const user = await db.user.findUnique({ where: { id } })
  return <div>{user.name}</div>
}

async function Sidebar() {
  const user = await db.user.findUnique({ where: { id } })
  return <div>{user.email}</div>
}
\`\`\`

## The Solution: cache()

\`\`\`tsx
import { cache } from 'react'

// Memoized for the request lifetime
const getUser = cache(async (id: string) => {
  return db.user.findUnique({ where: { id } })
})

// ✅ Now both components share the same query
async function Header() {
  const user = await getUser(userId)
}

async function Sidebar() {
  const user = await getUser(userId) // Uses cached result!
}
\`\`\`

## How It Works

- \`cache()\` memoizes by **arguments** (like React.memo for functions)
- Cache lasts for the **current request** only
- Perfect for database queries, computations, etc.

## With Prisma/Drizzle

\`\`\`tsx
// lib/data.ts
import { cache } from 'react'
import { db } from './db'

export const getCurrentUser = cache(async () => {
  const session = await getSession()
  if (!session?.userId) return null

  return db.user.findUnique({
    where: { id: session.userId }
  })
})
\`\`\`

## fetch() vs cache()

| Feature | fetch() | cache() |
|---------|---------|---------|
| Auto-dedupe | ✅ Yes | ❌ Manual |
| Data Cache | ✅ Yes | ❌ No |
| Use for | APIs | DB, compute |

## Try It
See the [Dedupe with cache() Lab](/lab/dedupe-cache).
    `.trim(),
  },
];

export const categories = [...new Set(docs.map((d) => d.category))];

export function getDocBySlug(slug: string) {
  return docs.find((d) => d.slug === slug);
}

export function getDocsByCategory(category: string) {
  return docs.filter((d) => d.category === category);
}
