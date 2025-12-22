import { ReactNode } from "react";
import {
  ArrowLeft,
  BookOpen,
  Code2,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

interface LabShellProps {
  title: string;
  description: string;
  concept: string;
  children: ReactNode;
  codeExample?: string;
  tips?: string[];
  warnings?: string[];
}

/**
 * LabShell - Wrapper component for each lab page
 *
 * Provides consistent structure:
 * - Title and description
 * - Key concept explanation
 * - Optional code example
 * - Tips and warnings
 * - Back navigation
 */
export function LabShell({
  title,
  description,
  concept,
  children,
  codeExample,
  tips = [],
  warnings = [],
}: LabShellProps) {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Labs
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100 mb-2">{title}</h1>
        <p className="text-lg text-zinc-400">{description}</p>
      </div>

      {/* Key Concept Box */}
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-blue-400 mb-2">
              Key Concept
            </h2>
            <p className="text-zinc-300 leading-relaxed">{concept}</p>
          </div>
        </div>
      </div>

      {/* Code Example (if provided) */}
      {codeExample && (
        <div className="mb-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-800/50">
            <Code2 className="w-4 h-4 text-zinc-500" />
            <span className="text-sm text-zinc-400">Implementation</span>
          </div>
          <pre className="p-4 text-sm text-zinc-300 overflow-x-auto">
            <code>{codeExample}</code>
          </pre>
        </div>
      )}

      {/* Main Content */}
      <div className="mb-8">{children}</div>

      {/* Tips */}
      {tips.length > 0 && (
        <div className="mb-6 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-emerald-400">Pro Tips</h3>
          </div>
          <ul className="space-y-2">
            {tips.map((tip, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-zinc-300"
              >
                <span className="text-emerald-400 mt-1">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="mb-6 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-amber-400">Watch Out</h3>
          </div>
          <ul className="space-y-2">
            {warnings.map((warning, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-zinc-300"
              >
                <span className="text-amber-400 mt-1">•</span>
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Documentation Link */}
      <div className="mt-8 pt-6 border-t border-zinc-800">
        <a
          href="https://nextjs.org/docs/app/building-your-application/data-fetching"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Read the Next.js Data Fetching docs
        </a>
      </div>
    </div>
  );
}
