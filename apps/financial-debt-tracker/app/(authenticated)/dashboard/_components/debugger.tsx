"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/design-system/components/ui/popover";
import { Bug } from "lucide-react";

interface DebuggerProps {
  data: unknown;
}

export function Debugger({ data }: DebuggerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Wait for client-side mount to use portal
  if (!mounted) {
    return null;
  }

  // TODO: Add back environment check after testing
  if (process.env.NODE_ENV !== "development") return null;

  return createPortal(
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-9999">
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-black shadow-lg transition-transform hover:scale-110 hover:bg-amber-400"
            aria-label="Open debugger"
          >
            <Bug className="h-6 w-6" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="center"
          className="w-[500px] p-0 overflow-hidden"
        >
          <div className="flex items-center gap-2 border-b px-4 py-3 bg-popover sticky top-0">
            <Bug className="h-4 w-4" />
            <span className="font-semibold text-sm">Debug Data</span>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            <pre className="p-4 text-xs whitespace-pre-wrap break-words">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </PopoverContent>
      </Popover>
    </div>,
    document.body,
  );
}
