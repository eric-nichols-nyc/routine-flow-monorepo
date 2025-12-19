// Dashboard data types

export type ExpenseMetrics = {
  totalExpenses: number;
  interestPaid: number;
  recurringCharges: number;
  creditCardSpending: number;
  loanPayments: number;
  totalExpensesChange: number;
  interestPaidChange: number;
  recurringChargesChange: number;
  creditCardSpendingChange: number;
  loanPaymentsChange: number;
};

export type Account = {
  id: string;
  name: string;
  type: string;
  balance: number;
  credit_limit?: number;
};

export type UnreviewedTransaction = {
  id: string;
  amount: number;
  description: string | null;
  date: string;
  type: string;
  account: {
    name: string;
  };
  category: {
    name: string;
    color: string | null;
  } | null;
};

export type TopCategory = {
  name: string;
  spent: number;
  budget: number | null;
  color: string | null;
};

export type UpcomingRecurring = {
  id: string;
  name: string;
  amount: number;
  frequency: string;
  next_due_date: string;
  account: {
    name: string;
  };
  category: {
    name: string;
  };
};

export type DashboardDataSuccess = {
  success: true;
  debug?: {
    userId: string;
    userEmail: string | undefined;
  };
  expenseMetrics: ExpenseMetrics;
  accounts: Account[];
  unreviewedTransactions: UnreviewedTransaction[];
  topCategories: TopCategory[];
  monthlyIncome: number;
  monthlyExpenses: number;
  previousMonthIncome: number;
  previousMonthExpenses: number;
  upcomingRecurring: UpcomingRecurring[];
};

export type DashboardDataError = {
  success: false;
  error: string;
};

export type DashboardDataResult = DashboardDataSuccess | DashboardDataError;
