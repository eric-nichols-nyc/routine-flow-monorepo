"use client";

import { useState, useEffect } from "react";
import { MousePointer } from "lucide-react";

export function MouseTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
      <p className="text-xs text-zinc-500 mb-3">Mouse Position (Browser API)</p>

      <div className="flex items-center justify-center gap-4 mb-4">
        <MousePointer className="w-5 h-5 text-blue-400" />
        <div className="text-center">
          {isClient ? (
            <>
              <p className="text-2xl font-bold text-blue-400">
                {position.x}, {position.y}
              </p>
              <p className="text-xs text-zinc-500">x, y coordinates</p>
            </>
          ) : (
            <p className="text-sm text-zinc-500">Loading...</p>
          )}
        </div>
      </div>

      <p className="text-xs text-zinc-600 text-center">
        Move your mouse to see coordinates update
      </p>

      <div className="mt-3 pt-3 border-t border-zinc-700">
        <p className="text-xs text-zinc-600">
          Uses: <code className="text-blue-400">window.addEventListener</code>
        </p>
      </div>
    </div>
  );
}
