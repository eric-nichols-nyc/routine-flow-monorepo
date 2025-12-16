import { ModeToggle } from "../mode-toggle";
import { UserMenu, type UserMenuUser } from "./user-menu";

export interface StickyHeaderProps {
  user: UserMenuUser;
  onLogout?: () => void;
  accountHref?: string;
}

export function StickyHeader({ user, onLogout, accountHref }: StickyHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="px-2 flex h-14 items-center justify-between">
        <UserMenu user={user} onLogout={onLogout} accountHref={accountHref} />
        <ModeToggle />
      </div>
    </header>
  );
}

