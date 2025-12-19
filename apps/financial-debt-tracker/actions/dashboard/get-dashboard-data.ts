"use server";

import { createClient } from "@/utils/supabase/server";
import type { DashboardDataResult } from "./types";
import {
  getMonthDateRange,
  getPreviousMonth,
  getDaysFromNow,
  calculateMonthlyIncome,
  calculateMonthlyExpenses,
  calculateCategorySpending,
  getTopCategoriesWithBudgets,
  transformAccounts,
  transformUnreviewedTransactions,
  transformUpcomingRecurring,
  getExpenseMetricsWithComparison,
} from "./helpers";

// Re-export types for consumers
export type { DashboardDataResult } from "./types";

export async function getDashboardData(): Promise<DashboardDataResult> {
  const supabase = await createClient();

  // Get the authenticated Supabase user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return {
      success: false,
      error:
        "No authenticated user found. Please sign in to view your dashboard.",
    };
  }

  const userId = user.id;

  // Calculate date ranges
  const currentMonth = new Date();
  const { start: currentMonthStart, end: currentMonthEnd } =
    getMonthDateRange(currentMonth);
  const previousMonth = getPreviousMonth(currentMonth);
  const { start: previousMonthStart, end: previousMonthEnd } =
    getMonthDateRange(previousMonth);
  const twoWeeksFromNow = getDaysFromNow(14);

  try {
    // ⚡ Parallelize all independent database queries
    const [
      expenseMetrics,
      accountsResult,
      unreviewedTransactionsResult,
      currentMonthTransactionsResult,
      previousMonthTransactionsResult,
      budgetsResult,
      upcomingRecurringResult,
    ] = await Promise.all([
      // Expense metrics with month-over-month comparison
      getExpenseMetricsWithComparison(
        supabase,
        userId,
        currentMonthStart,
        currentMonthEnd,
        previousMonthStart,
        previousMonthEnd,
      ),

      // All accounts
      supabase
        .from("accounts")
        .select("id, name, type, balance, credit_limit")
        .eq("user_id", userId),

      // Unreviewed transactions (without categories)
      supabase
        .from("transactions")
        .select(
          "id, amount, description, date, type, accounts!inner(name), categories(name, color)",
        )
        .eq("user_id", userId)
        .is("category_id", null)
        .eq("type", "EXPENSE")
        .order("date", { ascending: false })
        .limit(10),

      // Current month transactions
      supabase
        .from("transactions")
        .select("id, amount, type, categories(name, color)")
        .eq("user_id", userId)
        .gte("date", currentMonthStart.toISOString())
        .lte("date", currentMonthEnd.toISOString()),

      // Previous month transactions
      supabase
        .from("transactions")
        .select("id, amount, type")
        .eq("user_id", userId)
        .gte("date", previousMonthStart.toISOString())
        .lte("date", previousMonthEnd.toISOString()),

      // Active budgets
      supabase
        .from("budgets")
        .select("id, amount, categories!inner(name)")
        .eq("user_id", userId)
        .lte("start_date", currentMonthEnd.toISOString())
        .or(`end_date.is.null,end_date.gte.${currentMonthStart.toISOString()}`),

      // Upcoming recurring charges (next 2 weeks)
      supabase
        .from("recurring_charges")
        .select(
          "id, name, amount, frequency, next_due_date, accounts!inner(name), categories!inner(name)",
        )
        .eq("user_id", userId)
        .gte("next_due_date", new Date().toISOString())
        .lte("next_due_date", twoWeeksFromNow.toISOString())
        .order("next_due_date", { ascending: true })
        .limit(10),
    ]);

    // Handle errors
    if (accountsResult.error) {
      console.error("Error fetching accounts:", accountsResult.error);
      return { success: false, error: accountsResult.error.message };
    }

    // Extract data with defaults
    const accounts = accountsResult.data || [];
    const unreviewedTransactions = unreviewedTransactionsResult.data || [];
    const currentMonthTransactions = currentMonthTransactionsResult.data || [];
    const previousMonthTransactions =
      previousMonthTransactionsResult.data || [];
    const budgets = budgetsResult.data || [];
    const upcomingRecurring = upcomingRecurringResult.data || [];

    // Calculate derived metrics
    const monthlyIncome = calculateMonthlyIncome(currentMonthTransactions);
    const monthlyExpenses = calculateMonthlyExpenses(currentMonthTransactions);
    const previousMonthIncome = calculateMonthlyIncome(
      previousMonthTransactions,
    );
    const previousMonthExpenses = calculateMonthlyExpenses(
      previousMonthTransactions,
    );

    // Calculate category spending and top categories
    const categorySpending = calculateCategorySpending(
      currentMonthTransactions.map((t) => ({
        ...t,
        categories: Array.isArray(t.categories)
          ? t.categories[0]
          : t.categories,
      })),
    );
    const topCategories = getTopCategoriesWithBudgets(
      categorySpending,
      budgets.map((b) => ({
        ...b,
        categories: Array.isArray(b.categories)
          ? b.categories[0]
          : b.categories,
      })),
    );

    return {
      success: true,
      debug: {
        userId: user.id,
        userEmail: user.email,
      },
      expenseMetrics,
      accounts: transformAccounts(accounts),
      unreviewedTransactions: transformUnreviewedTransactions(
        unreviewedTransactions,
      ),
      topCategories,
      monthlyIncome,
      monthlyExpenses,
      previousMonthIncome,
      previousMonthExpenses,
      upcomingRecurring: transformUpcomingRecurring(upcomingRecurring),
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      success: false,
      error: "An unexpected error occurred while loading dashboard data.",
    };
  }
}
