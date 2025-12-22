interface CodeBlockProps {
  code: string;
  filename?: string;
  language?: string;
}

export function CodeBlock({
  code,
  filename,
  language = "typescript",
}: CodeBlockProps) {
  const lines = code.trim().split("\n");

  return (
    <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/50">
      {filename && (
        <div className="px-4 py-2 bg-zinc-800/50 border-b border-zinc-800 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
          </div>
          <span className="text-xs text-zinc-400 ml-2 font-mono">
            {filename}
          </span>
          {language && (
            <span className="ml-auto text-xs text-zinc-600">{language}</span>
          )}
        </div>
      )}
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="text-zinc-600 w-8 text-right pr-4 select-none">
                  {i + 1}
                </span>
                <span className="text-zinc-300">{line || " "}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
