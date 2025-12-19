/**
 * Expense metrics calculation with month-over-month comparison
 */

import { createClient } from "@/utils/supabase/server";
import { calculatePercentageChange } from "./calculations";
import type { ExpenseMetrics } from "../types";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

/**
 * Fetch and calculate expense metrics with comparison to previous month
 */
export async function getExpenseMetricsWithComparison(
  supabase: SupabaseClient,
  userId: string,
  currentMonthStart: Date,
  currentMonthEnd: Date,
  previousMonthStart: Date,
  previousMonthEnd: Date,
): Promise<ExpenseMetrics> {
  // Fetch all data in parallel
  const [
    { data: currentTransactions },
    { data: previousTransactions },
    { data: currentRecurring },
    { data: previousRecurring },
  ] = await Promise.all([
    supabase
      .from("transactions")
      .select("amount, type, accounts!inner(type)")
      .eq("user_id", userId)
      .gte("date", currentMonthStart.toISOString())
      .lte("date", currentMonthEnd.toISOString()),

    supabase
      .from("transactions")
      .select("amount, type, accounts!inner(type)")
      .eq("user_id", userId)
      .gte("date", previousMonthStart.toISOString())
      .lte("date", previousMonthEnd.toISOString()),

    supabase
      .from("recurring_charges")
      .select("amount")
      .eq("user_id", userId)
      .gte("next_due_date", currentMonthStart.toISOString())
      .lte("next_due_date", currentMonthEnd.toISOString()),

    supabase
      .from("recurring_charges")
      .select("amount")
      .eq("user_id", userId)
      .gte("next_due_date", previousMonthStart.toISOString())
      .lte("next_due_date", previousMonthEnd.toISOString()),
  ]);

  const current = currentTransactions || [];
  const previous = previousTransactions || [];

  // Helper to get account type safely
  const getAccountType = (t: { accounts: unknown }): string => {
    const accounts = t.accounts as { type: string } | { type: string }[];
    if (Array.isArray(accounts)) {
      return accounts[0]?.type ?? "";
    }
    return accounts?.type ?? "";
  };

  // Calculate current month metrics
  const totalExpenses = current
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const interestPaid = current
    .filter((t) => t.type === "INTEREST_CHARGE")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const creditCardSpending = current
    .filter((t) => t.type === "EXPENSE" && getAccountType(t) === "CREDIT_CARD")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const loanPayments = current
    .filter((t) => t.type === "LOAN_PAYMENT")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const recurringCharges = (currentRecurring || []).reduce(
    (sum, r) => sum + Number(r.amount),
    0,
  );

  // Calculate previous month metrics
  const prevTotalExpenses = previous
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const prevInterestPaid = previous
    .filter((t) => t.type === "INTEREST_CHARGE")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const prevCreditCardSpending = previous
    .filter((t) => t.type === "EXPENSE" && getAccountType(t) === "CREDIT_CARD")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const prevLoanPayments = previous
    .filter((t) => t.type === "LOAN_PAYMENT")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const prevRecurringCharges = (previousRecurring || []).reduce(
    (sum, r) => sum + Number(r.amount),
    0,
  );

  return {
    totalExpenses,
    interestPaid,
    recurringCharges,
    creditCardSpending,
    loanPayments,
    totalExpensesChange: calculatePercentageChange(
      totalExpenses,
      prevTotalExpenses,
    ),
    interestPaidChange: calculatePercentageChange(
      interestPaid,
      prevInterestPaid,
    ),
    recurringChargesChange: calculatePercentageChange(
      recurringCharges,
      prevRecurringCharges,
    ),
    creditCardSpendingChange: calculatePercentageChange(
      creditCardSpending,
      prevCreditCardSpending,
    ),
    loanPaymentsChange: calculatePercentageChange(
      loanPayments,
      prevLoanPayments,
    ),
  };
}
