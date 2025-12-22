"use client";

import { useDashboard } from "@/hooks/use-dashboard";
import { StatCard } from "./stat-card";
import { AccountListCard } from "./account-list-card";
import { Debugger } from "./debugger";
import { DollarSign, CreditCard, Landmark, RefreshCw } from "lucide-react";

export function DashboardClient() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="p-4 text-muted-foreground">Loading dashboard data...</div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading dashboard: {error.message}
      </div>
    );
  }

  if (!data?.success) {
    return (
      <div className="p-4 text-red-500">
        {data?.error || "Failed to load dashboard data"}
      </div>
    );
  }

  const { expenseMetrics, accounts, upcomingRecurring } = data;

  // Transform accounts into list items
  const creditCards = accounts
    .filter((a) => a.type === "CREDIT_CARD")
    .map((a) => ({
      id: a.id,
      name: a.name,
      amount: a.balance,
      subtitle: a.credit_limit
        ? `Limit: $${a.credit_limit.toLocaleString()}`
        : undefined,
    }));

  const loans = accounts
    .filter((a) => a.type === "LOAN")
    .map((a) => ({
      id: a.id,
      name: a.name,
      amount: a.balance,
    }));

  // Transform recurring charges
  const recurringItems = upcomingRecurring.map((r) => ({
    id: r.id,
    name: r.name,
    amount: r.amount,
    subtitle: r.frequency,
  }));

  // Transform upcoming payments (same data, different presentation)
  const upcomingItems = upcomingRecurring.map((r) => ({
    id: r.id,
    name: r.name,
    amount: r.amount,
    subtitle: new Date(r.next_due_date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <>
      <div className="space-y-6 p-4">
        {/* Stat Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Expenses"
            value={expenseMetrics.totalExpenses}
            change={expenseMetrics.totalExpensesChange}
            icon={<DollarSign className="h-4 w-4" />}
          />
          <StatCard
            title="Credit Cards"
            value={expenseMetrics.creditCardSpending}
            change={expenseMetrics.creditCardSpendingChange}
            icon={<CreditCard className="h-4 w-4" />}
          />
          <StatCard
            title="Loans"
            value={expenseMetrics.loanPayments}
            change={expenseMetrics.loanPaymentsChange}
            icon={<Landmark className="h-4 w-4" />}
          />
          <StatCard
            title="Recurring Charges"
            value={expenseMetrics.recurringCharges}
            change={expenseMetrics.recurringChargesChange}
            icon={<RefreshCw className="h-4 w-4" />}
          />
        </div>

        {/* Account Lists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AccountListCard variant="credit-cards" items={creditCards} />
          <AccountListCard variant="loans" items={loans} />
          <AccountListCard variant="recurring" items={recurringItems} />
          <AccountListCard variant="upcoming" items={upcomingItems} />
        </div>
      </div>

      {/* Debug popup - only visible in development */}
      <Debugger data={data} />
    </>
  );
}
