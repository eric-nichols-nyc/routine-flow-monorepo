"use client";

import { useState } from "react";
import { useFetch } from "@/hooks/use-fetch";
import { RefreshCw, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export function ApiMockingDemo() {
  return (
    <div className="space-y-6">
      <UsersDemo />
      <PostsDemo />
      <ErrorDemo />
    </div>
  );
}

function UsersDemo() {
  const { data, error, isLoading, refetch } = useFetch<User[]>("/api/users");

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-100">GET /api/users</h3>
        <button
          onClick={refetch}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-100 text-sm transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Refetch
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-zinc-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading...
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-400">
          <AlertCircle className="w-4 h-4" />
          {error.message}
        </div>
      )}

      {data && (
        <div className="space-y-2" data-testid="users-list">
          {data.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 rounded-lg bg-zinc-800"
            >
              <div>
                <p className="text-zinc-100 font-medium">{user.name}</p>
                <p className="text-zinc-500 text-sm">{user.email}</p>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-xs ${
                  user.role === "admin"
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-zinc-700 text-zinc-400"
                }`}
              >
                {user.role}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PostsDemo() {
  const [userId, setUserId] = useState<number | null>(null);
  const url = userId ? `/api/posts?userId=${userId}` : "/api/posts";
  const { data, isLoading, refetch } = useFetch<Post[]>(url);

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-100">
          GET /api/posts {userId && `?userId=${userId}`}
        </h3>
        <div className="flex gap-2">
          {[null, 1, 2].map((id) => (
            <button
              key={id ?? "all"}
              onClick={() => setUserId(id)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                userId === id
                  ? "bg-violet-500 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-zinc-100"
              }`}
            >
              {id === null ? "All" : `User ${id}`}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-zinc-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading posts...
        </div>
      ) : (
        <div className="space-y-2" data-testid="posts-list">
          {data?.map((post) => (
            <div key={post.id} className="p-3 rounded-lg bg-zinc-800">
              <p className="text-zinc-100">{post.title}</p>
              <p className="text-zinc-500 text-sm mt-1">{post.body}</p>
            </div>
          ))}
          {data?.length === 0 && (
            <p className="text-zinc-500 text-sm">No posts found</p>
          )}
        </div>
      )}
    </div>
  );
}

function ErrorDemo() {
  const { data, error, isLoading, refetch } = useFetch<unknown>("/api/error", {
    immediate: false,
  });
  const [triggered, setTriggered] = useState(false);

  const triggerError = async () => {
    setTriggered(true);
    await refetch();
  };

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-100">
          Error Handling Demo
        </h3>
        <button
          onClick={triggerError}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm transition-colors"
        >
          <AlertCircle className="w-4 h-4" />
          Trigger 500 Error
        </button>
      </div>

      <p className="text-sm text-zinc-500 mb-4">
        Click to fetch from an endpoint that returns a 500 error
      </p>

      {isLoading && (
        <div className="flex items-center gap-2 text-zinc-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading...
        </div>
      )}

      {error && (
        <div
          className="p-4 rounded-lg bg-red-500/10 border border-red-500/20"
          data-testid="error-message"
        >
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertCircle className="w-4 h-4" />
            Error caught!
          </div>
          <p className="text-sm text-zinc-400">{error.message}</p>
        </div>
      )}

      {!triggered && !error && (
        <div className="p-4 rounded-lg bg-zinc-800 text-zinc-500 text-sm">
          No request made yet
        </div>
      )}
    </div>
  );
}
