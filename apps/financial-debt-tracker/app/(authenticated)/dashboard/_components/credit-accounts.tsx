"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { CreditCard } from "lucide-react";
import type { Account } from "@/actions/dashboard/types";

interface CreditAccountsProps {
  accounts: Account[];
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function CreditAccounts({ accounts }: CreditAccountsProps) {
  const creditCards = accounts.filter(
    (account) => account.type === "CREDIT_CARD",
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Credit Cards</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {creditCards.length === 0 ? (
          <p className="text-sm text-muted-foreground">No credit cards found</p>
        ) : (
          <ul className="space-y-3">
            {creditCards.map((card) => (
              <li
                key={card.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                {/* Placeholder icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>

                {/* Account details */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{card.name}</p>
                  {card.credit_limit && (
                    <p className="text-xs text-muted-foreground">
                      Limit: {formatCurrency(card.credit_limit)}
                    </p>
                  )}
                </div>

                {/* Balance */}
                <div className="text-right">
                  <p className="font-semibold text-red-500">
                    {formatCurrency(card.balance)}
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
