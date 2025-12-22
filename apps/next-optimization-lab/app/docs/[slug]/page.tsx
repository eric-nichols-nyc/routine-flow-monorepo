import { notFound } from "next/navigation";
import Link from "next/link";
import { docs, getDocBySlug, categories } from "@/content/docs";
import { ArrowLeft, FlaskConical, ChevronRight } from "lucide-react";

// Simple markdown-ish renderer (no external deps)
function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let codeLanguage = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLanguage = line.slice(3).trim();
        codeContent = [];
      } else {
        elements.push(
          <pre
            key={i}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 overflow-x-auto my-4 text-sm"
          >
            <code className="text-zinc-300">{codeContent.join("\n")}</code>
          </pre>,
        );
        inCodeBlock = false;
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }

    // Headers
    if (line.startsWith("# ")) {
      elements.push(
        <h1
          key={i}
          className="text-3xl font-bold text-zinc-100 mt-8 mb-4 first:mt-0"
        >
          {line.slice(2)}
        </h1>,
      );
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={i}
          className="text-xl font-semibold text-zinc-100 mt-8 mb-3 border-b border-zinc-800 pb-2"
        >
          {line.slice(3)}
        </h2>,
      );
      continue;
    }
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-lg font-medium text-zinc-200 mt-6 mb-2">
          {line.slice(4)}
        </h3>,
      );
      continue;
    }

    // Tables
    if (line.startsWith("|")) {
      const tableLines = [line];
      let j = i + 1;
      while (j < lines.length && lines[j].startsWith("|")) {
        tableLines.push(lines[j]);
        j++;
      }
      i = j - 1;

      const rows = tableLines.filter((l) => !l.includes("---"));
      elements.push(
        <div key={i} className="overflow-x-auto my-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                {rows[0]
                  .split("|")
                  .filter(Boolean)
                  .map((cell, idx) => (
                    <th
                      key={idx}
                      className="text-left py-2 px-3 text-zinc-400 font-medium"
                    >
                      {cell.trim()}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(1).map((row, rowIdx) => (
                <tr key={rowIdx} className="border-b border-zinc-800/50">
                  {row
                    .split("|")
                    .filter(Boolean)
                    .map((cell, cellIdx) => (
                      <td key={cellIdx} className="py-2 px-3 text-zinc-300">
                        {renderInline(cell.trim())}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    // List items
    if (line.startsWith("- ")) {
      elements.push(
        <li key={i} className="text-zinc-300 ml-4 my-1 list-disc">
          {renderInline(line.slice(2))}
        </li>,
      );
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      elements.push(
        <li key={i} className="text-zinc-300 ml-4 my-1 list-decimal">
          {renderInline(line.replace(/^\d+\.\s/, ""))}
        </li>,
      );
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="text-zinc-400 my-3 leading-relaxed">
        {renderInline(line)}
      </p>,
    );
  }

  return elements;
}

// Inline formatting (bold, code, links)
function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Links [text](url)
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch && linkMatch.index !== undefined) {
      if (linkMatch.index > 0) {
        parts.push(
          renderInlineSegment(remaining.slice(0, linkMatch.index), key++),
        );
      }
      parts.push(
        <Link
          key={key++}
          href={linkMatch[2]}
          className="text-teal-400 hover:text-teal-300 underline"
        >
          {linkMatch[1]}
        </Link>,
      );
      remaining = remaining.slice(linkMatch.index + linkMatch[0].length);
      continue;
    }

    // Bold **text**
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) {
        parts.push(
          renderInlineSegment(remaining.slice(0, boldMatch.index), key++),
        );
      }
      parts.push(
        <strong key={key++} className="text-zinc-200 font-semibold">
          {boldMatch[1]}
        </strong>,
      );
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
      continue;
    }

    // Inline code `code`
    const codeMatch = remaining.match(/`([^`]+)`/);
    if (codeMatch && codeMatch.index !== undefined) {
      if (codeMatch.index > 0) {
        parts.push(
          renderInlineSegment(remaining.slice(0, codeMatch.index), key++),
        );
      }
      parts.push(
        <code
          key={key++}
          className="bg-zinc-800 text-teal-300 px-1.5 py-0.5 rounded text-sm font-mono"
        >
          {codeMatch[1]}
        </code>,
      );
      remaining = remaining.slice(codeMatch.index + codeMatch[0].length);
      continue;
    }

    // No more matches, push the rest
    parts.push(<span key={key++}>{remaining}</span>);
    break;
  }

  return parts.length === 1 ? parts[0] : parts;
}

function renderInlineSegment(text: string, key: number): React.ReactNode {
  return <span key={key}>{text}</span>;
}

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return docs.map((doc) => ({ slug: doc.slug }));
}

export default async function DocPage({ params }: { params: Params }) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  // Get prev/next docs
  const currentIndex = docs.findIndex((d) => d.slug === slug);
  const prevDoc = currentIndex > 0 ? docs[currentIndex - 1] : null;
  const nextDoc =
    currentIndex < docs.length - 1 ? docs[currentIndex + 1] : null;

  return (
    <div className="max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
        <Link href="/docs" className="hover:text-zinc-300 transition-colors">
          Docs
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-zinc-400">{doc.title}</span>
      </div>

      {/* Related Lab Banner */}
      {doc.relatedLab && (
        <Link
          href={doc.relatedLab}
          className="flex items-center gap-3 p-3 mb-6 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 hover:bg-teal-500/20 transition-colors group"
        >
          <FlaskConical className="w-5 h-5" />
          <span className="text-sm">
            <strong>Try it:</strong> See this concept in action in the related
            lab
          </span>
          <ChevronRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </Link>
      )}

      {/* Content */}
      <article className="prose prose-invert max-w-none">
        {renderContent(doc.content)}
      </article>

      {/* Navigation */}
      <div className="mt-12 pt-6 border-t border-zinc-800 flex justify-between">
        {prevDoc ? (
          <Link
            href={`/docs/${prevDoc.slug}`}
            className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{prevDoc.title}</span>
          </Link>
        ) : (
          <div />
        )}
        {nextDoc && (
          <Link
            href={`/docs/${nextDoc.slug}`}
            className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <span className="text-sm">{nextDoc.title}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
