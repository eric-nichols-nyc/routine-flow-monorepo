import { RenderInfo } from "@/components/render-info";
import { CodeBlock } from "@/components/code-block";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Mock data for static posts
const posts: Record<
  string,
  { title: string; content: string; author: string; date: string }
> = {
  "intro-nextjs": {
    title: "Introduction to Next.js",
    content:
      "Next.js is a React framework that enables server-side rendering, static site generation, and more. It provides an excellent developer experience with features like automatic code splitting, optimized prefetching, and built-in CSS support.",
    author: "Jane Developer",
    date: "2024-01-15",
  },
  "react-server-components": {
    title: "Understanding React Server Components",
    content:
      "React Server Components allow you to render components on the server without sending JavaScript to the client. This results in smaller bundle sizes and faster page loads, while still maintaining the component-based architecture React is known for.",
    author: "John Engineer",
    date: "2024-02-20",
  },
  "typescript-guide": {
    title: "Building with TypeScript",
    content:
      "TypeScript adds static type checking to JavaScript, helping you catch errors early and improve code quality. When combined with Next.js, you get excellent IDE support, better refactoring capabilities, and more maintainable code.",
    author: "Alex Coder",
    date: "2024-03-10",
  },
};

// This function tells Next.js which pages to pre-render at build time
export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({
    slug,
  }));
}

// Generate metadata for each page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | Rendering Lab`,
    description: post.content.slice(0, 160),
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const buildTime = new Date().toISOString();
  const post = posts[slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl">
      <Link
        href="/static-generation"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Static Generation
      </Link>

      <RenderInfo
        title="Static Page (Pre-rendered)"
        renderTime={buildTime}
        renderLocation="build"
        description={`This page for "${slug}" was generated at build time via generateStaticParams.`}
      />

      {/* Article Content */}
      <article className="mb-8 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <header className="mb-6 pb-6 border-b border-zinc-800">
          <h1 className="text-3xl font-bold text-zinc-100 mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <span>By {post.author}</span>
            <span>•</span>
            <span>{post.date}</span>
          </div>
        </header>

        <p className="text-zinc-300 leading-relaxed">{post.content}</p>
      </article>

      {/* Technical Details */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">
          How This Page Was Generated
        </h3>
        <CodeBlock
          filename="app/static-generation/[slug]/page.tsx"
          code={`// 1. generateStaticParams runs at build time
export async function generateStaticParams() {
  // Returns all slugs to pre-render
  return Object.keys(posts).map((slug) => ({ slug }));
}

// 2. Each page is rendered with its params
export default async function Page({
  params
}: {
  params: { slug: string }
}) {
  const post = posts[params.slug];
  return <Article post={post} />;
}

// Result: Static HTML for each slug at build time
// - /static-generation/intro-nextjs
// - /static-generation/react-server-components
// - /static-generation/typescript-guide`}
        />
      </div>

      {/* Visual indicator */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <p className="text-sm text-amber-400">
          <strong>Proof it's static:</strong> Refresh this page multiple times.
          The render time above will stay exactly the same until you rebuild the
          project!
        </p>
      </div>
    </div>
  );
}
