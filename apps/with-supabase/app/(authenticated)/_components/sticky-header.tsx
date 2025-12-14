import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import { UserMenu } from "./user-menu";

interface StickyHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
  };
}

export function StickyHeader({ user }: StickyHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="px-2 flex h-14 items-center justify-between">
        <UserMenu user={user} />
        <ModeToggle />
      </div>
    </header>
  );
}
