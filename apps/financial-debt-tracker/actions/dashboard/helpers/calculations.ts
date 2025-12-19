/**
 * Financial calculation helper functions
 */

type TransactionWithCategory = {
  id: string;
  amount: number | string;
  type: string;
  categories?: { name: string; color: string | null } | null;
};

type TransactionBasic = {
  amount: number | string;
  type: string;
};

type CategorySpending = Record<
  string,
  { name: string; spent: number; color: string | null }
>;

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(
  current: number,
  previous: number,
): number {
  if (previous > 0) {
    return ((current - previous) / previous) * 100;
  }
  return current > 0 ? 100 : 0;
}

/**
 * Sum amounts for transactions of a specific type
 */
export function sumByType(
  transactions: TransactionBasic[],
  type: string,
): number {
  return transactions
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + Number(t.amount), 0);
}

/**
 * Calculate monthly income from transactions
 */
export function calculateMonthlyIncome(
  transactions: TransactionBasic[],
): number {
  return sumByType(transactions, "INCOME");
}

/**
 * Calculate monthly expenses from transactions
 */
export function calculateMonthlyExpenses(
  transactions: TransactionBasic[],
): number {
  return sumByType(transactions, "EXPENSE");
}

/**
 * Calculate spending by category for expense transactions
 */
export function calculateCategorySpending(
  transactions: TransactionWithCategory[],
): CategorySpending {
  return transactions
    .filter((t) => t.type === "EXPENSE" && t.categories)
    .reduce((acc, t) => {
      const category = t.categories!;
      const categoryName = category.name;
      const categoryColor = category.color;

      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          spent: 0,
          color: categoryColor,
        };
      }
      acc[categoryName].spent += Number(t.amount);
      return acc;
    }, {} as CategorySpending);
}

/**
 * Combine category spending with budget data and return top categories
 */
export function getTopCategoriesWithBudgets(
  categorySpending: CategorySpending,
  budgets: Array<{
    amount: number | string;
    categories?: { name: string } | null;
  }>,
  limit: number = 6,
) {
  return Object.values(categorySpending)
    .map((cat) => {
      const budget = budgets.find((b) => b.categories?.name === cat.name);
      return {
        ...cat,
        budget: budget ? Number(budget.amount) : null,
      };
    })
    .sort((a, b) => b.spent - a.spent)
    .slice(0, limit);
}
