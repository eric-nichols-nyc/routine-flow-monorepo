"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export function ComponentDemo() {
  return (
    <div className="space-y-6">
      <ButtonDemo />
      <FormDemo />
    </div>
  );
}

function ButtonDemo() {
  const [clickCount, setClickCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleAsyncClick = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setClickCount((c) => c + 1);
    setLoading(false);
  };

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      <h3 className="text-lg font-semibold text-zinc-100 mb-4">
        Button Component
      </h3>
      <p className="text-sm text-zinc-500 mb-4">
        Demo of a button with loading state
      </p>

      <div className="flex items-center gap-4">
        <button
          onClick={handleAsyncClick}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500 text-white hover:bg-violet-600 disabled:opacity-50 transition-colors"
          data-testid="async-button"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Click Me
            </>
          )}
        </button>

        <span className="text-zinc-400" data-testid="click-count">
          Clicked: {clickCount} times
        </span>
      </div>
    </div>
  );
}

function FormDemo() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError("Please enter a valid email");
      setStatus("error");
      return;
    }

    if (message.length < 10) {
      setError("Message must be at least 10 characters");
      setStatus("error");
      return;
    }

    setStatus("success");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      <h3 className="text-lg font-semibold text-zinc-100 mb-4">
        Form Component
      </h3>
      <p className="text-sm text-zinc-500 mb-4">
        Demo of form validation and submission
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm text-zinc-400 mb-1">
            Email
          </label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500"
            data-testid="email-input"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm text-zinc-400 mb-1">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500"
            data-testid="message-input"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-violet-500 text-white hover:bg-violet-600 transition-colors"
            data-testid="submit-button"
          >
            Submit
          </button>

          {status === "success" && (
            <span
              className="flex items-center gap-2 text-green-400 text-sm"
              data-testid="success-message"
            >
              <CheckCircle className="w-4 h-4" />
              Submitted successfully!
            </span>
          )}

          {status === "error" && (
            <span
              className="flex items-center gap-2 text-red-400 text-sm"
              data-testid="error-message"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
