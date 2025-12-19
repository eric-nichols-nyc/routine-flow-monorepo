import {
  LayoutDashboard,
  CreditCard,
  Target,
  DollarSign,
  Wallet,
  TrendingUp,
  PieChart,
  Repeat,
  User,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavigationItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: number;
};

/**
 * Main navigation items for the sidebar
 */
export const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: CreditCard,
    badge: 4, // TODO: Make this dynamic from unreviewed transactions count
  },
  {
    title: "Goals",
    url: "/goals",
    icon: Target,
  },
  {
    title: "Cash flow",
    url: "/cash-flow",
    icon: DollarSign,
  },
  {
    title: "Accounts",
    url: "/accounts",
    icon: Wallet,
  },
  {
    title: "Investments",
    url: "/investments",
    icon: TrendingUp,
  },
  {
    title: "Categories",
    url: "/categories",
    icon: PieChart,
  },
  {
    title: "Recurrings",
    url: "/recurrings",
    icon: Repeat,
  },
];

/**
 * Settings navigation items for the sidebar
 */
export const settingsItems: NavigationItem[] = [
  {
    title: "Account",
    url: "/account",
    icon: User,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];
