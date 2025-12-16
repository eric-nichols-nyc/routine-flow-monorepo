"use client";

import { StickyHeader } from "@repo/design-system/components/ui/sticky-header";
import { logout } from "../actions";

interface AppHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
  };
}

export function AppHeader({ user }: AppHeaderProps) {
  return <StickyHeader user={user} onLogout={() => logout()} />;
}

