"use client";

import { useDashboard } from "@/hooks/use-dashboard";
import { MonthlySpending } from "./monthly-spending";
import { StatCard } from "./stat-card";
import { CreditAccounts } from "./credit-accounts";
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

  const { expenseMetrics, accounts } = data;

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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Credit Accounts List */}
          <CreditAccounts accounts={accounts} />
        </div>
      </div>

      {/* Debug popup - only visible in development */}
      <Debugger data={data} />
    </>
  );
}
