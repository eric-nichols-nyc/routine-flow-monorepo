"use client";

import { Suspense, useState, use } from "react";
import { RenderTracker } from "@/components/render-tracker";
import { Loader2, RefreshCw, User, Mail, MapPin } from "lucide-react";

// Simulated data fetching with Promise
function createUserPromise() {
  return new Promise<{ name: string; email: string; location: string }>(
    (resolve) =>
      setTimeout(
        () =>
          resolve({
            name: "Jane Doe",
            email: "jane@example.com",
            location: "San Francisco, CA",
          }),
        2000,
      ),
  );
}

function createPostsPromise() {
  return new Promise<{ title: string; likes: number }[]>((resolve) =>
    setTimeout(
      () =>
        resolve([
          { title: "Understanding React Suspense", likes: 142 },
          { title: "Code Splitting Best Practices", likes: 89 },
          { title: "Performance Optimization Tips", likes: 203 },
        ]),
      1500,
    ),
  );
}

function createStatsPromise() {
  return new Promise<{ followers: number; posts: number; likes: number }>(
    (resolve) =>
      setTimeout(
        () =>
          resolve({
            followers: 1234,
            posts: 56,
            likes: 8901,
          }),
        1000,
      ),
  );
}

// Components that use() to read promises
function UserInfo({
  userPromise,
}: {
  userPromise: Promise<{ name: string; email: string; location: string }>;
}) {
  const user = use(userPromise);

  return (
    <RenderTracker name="UserInfo (2s load)" color="blue">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-blue-400" />
          <span className="text-zinc-200 font-medium">{user.name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Mail className="w-3 h-3 text-zinc-500" />
          <span className="text-zinc-400">{user.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-3 h-3 text-zinc-500" />
          <span className="text-zinc-400">{user.location}</span>
        </div>
      </div>
    </RenderTracker>
  );
}

function Posts({
  postsPromise,
}: {
  postsPromise: Promise<{ title: string; likes: number }[]>;
}) {
  const posts = use(postsPromise);

  return (
    <RenderTracker name="Posts (1.5s load)" color="emerald">
      <div className="space-y-2">
        {posts.map((post, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-zinc-300 truncate">{post.title}</span>
            <span className="text-emerald-400">♥ {post.likes}</span>
          </div>
        ))}
      </div>
    </RenderTracker>
  );
}

function Stats({
  statsPromise,
}: {
  statsPromise: Promise<{ followers: number; posts: number; likes: number }>;
}) {
  const stats = use(statsPromise);

  return (
    <RenderTracker name="Stats (1s load)" color="amber">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xl font-bold text-amber-400">
            {stats.followers.toLocaleString()}
          </p>
          <p className="text-xs text-zinc-500">Followers</p>
        </div>
        <div>
          <p className="text-xl font-bold text-amber-400">{stats.posts}</p>
          <p className="text-xs text-zinc-500">Posts</p>
        </div>
        <div>
          <p className="text-xl font-bold text-amber-400">
            {stats.likes.toLocaleString()}
          </p>
          <p className="text-xs text-zinc-500">Likes</p>
        </div>
      </div>
    </RenderTracker>
  );
}

function Skeleton({ height = "h-24" }: { height?: string }) {
  return (
    <div
      className={`${height} rounded-xl bg-zinc-800/50 animate-pulse flex items-center justify-center`}
    >
      <Loader2 className="w-5 h-5 animate-spin text-zinc-600" />
    </div>
  );
}

export function SuspenseDemo() {
  const [key, setKey] = useState(0);

  // Create promises on each key change (simulates refetch)
  const userPromise = createUserPromise();
  const postsPromise = createPostsPromise();
  const statsPromise = createStatsPromise();

  const reload = () => setKey((k) => k + 1);

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-zinc-400">
          Watch components load independently at different speeds
        </p>
        <button
          onClick={reload}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Reload All
        </button>
      </div>

      <div key={key} className="grid grid-cols-3 gap-4">
        {/* Each Suspense boundary loads independently */}
        <Suspense fallback={<Skeleton height="h-32" />}>
          <UserInfo userPromise={userPromise} />
        </Suspense>

        <Suspense fallback={<Skeleton height="h-32" />}>
          <Posts postsPromise={postsPromise} />
        </Suspense>

        <Suspense fallback={<Skeleton height="h-32" />}>
          <Stats statsPromise={statsPromise} />
        </Suspense>
      </div>

      <div className="mt-4 p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
        <p className="text-sm text-violet-400">
          <strong>React 19 use() hook:</strong>
        </p>
        <p className="text-xs text-zinc-400 mt-1">
          Each component uses the <code className="text-violet-400">use()</code>{" "}
          hook to read a Promise. When the Promise is pending, React "suspends"
          the component and shows the fallback. Components load independently as
          their data resolves.
        </p>
      </div>
    </div>
  );
}
