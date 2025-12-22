"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@repo/design-system/components/ui/card";
import {
  CreditCard,
  Landmark,
  RefreshCw,
  Calendar,
  type LucideIcon,
} from "lucide-react";

type ListVariant = "credit-cards" | "loans" | "recurring" | "upcoming";

interface ListItem {
  id: string;
  name: string;
  amount: number;
  subtitle?: string;
}

interface AccountListCardProps {
  variant: ListVariant;
  items: ListItem[];
  onViewAll?: () => void;
}

const variantConfig: Record<
  ListVariant,
  {
    title: string;
    icon: LucideIcon;
    iconGradient: string;
    emptyMessage: string;
    amountColor: string;
  }
> = {
  "credit-cards": {
    title: "Credit Cards",
    icon: CreditCard,
    iconGradient: "from-violet-500 to-purple-600",
    emptyMessage: "No credit cards found",
    amountColor: "text-red-500",
  },
  loans: {
    title: "Loan Accounts",
    icon: Landmark,
    iconGradient: "from-amber-500 to-orange-600",
    emptyMessage: "No loan accounts found",
    amountColor: "text-red-500",
  },
  recurring: {
    title: "Recurring Charges",
    icon: RefreshCw,
    iconGradient: "from-cyan-500 to-blue-600",
    emptyMessage: "No recurring charges found",
    amountColor: "text-foreground",
  },
  upcoming: {
    title: "Upcoming Payments",
    icon: Calendar,
    iconGradient: "from-emerald-500 to-green-600",
    emptyMessage: "No upcoming payments",
    amountColor: "text-foreground",
  },
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function AccountListCard({
  variant,
  items,
  onViewAll,
}: AccountListCardProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">{config.title}</CardTitle>
        {onViewAll && (
          <CardAction>
            <button
              type="button"
              onClick={onViewAll}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View all
            </button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{config.emptyMessage}</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                {/* Icon */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${config.iconGradient}`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  {item.subtitle && (
                    <p className="text-xs text-muted-foreground">
                      {item.subtitle}
                    </p>
                  )}
                </div>

                {/* Amount */}
                <div className="text-right">
                  <p className={`font-semibold ${config.amountColor}`}>
                    {formatCurrency(item.amount)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
