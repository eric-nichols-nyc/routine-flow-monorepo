// proxy.ts (Next.js 16 uses proxy(), not middleware())
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * =============================================================================
 * RENDERING LAB: Proxy Configuration (Next.js 16)
 * =============================================================================
 *
 * This demo app doesn't need special proxy logic, so we just pass through.
 */

export async function proxy(request: NextRequest) {
  // No special proxy logic needed for this demo app
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only apply to API routes if needed
    "/api/:path*",
  ],
};
