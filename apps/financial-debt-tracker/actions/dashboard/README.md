# Dashboard Data Action

Fetches all financial data for the dashboard in a single optimized server action.

## File Structure

```
dashboard/
├── get-dashboard-data.ts    # Main server action
├── types.ts                 # TypeScript types for response
├── README.md                # This file
└── helpers/
    ├── index.ts             # Re-exports all helpers
    ├── date.ts              # Date range utilities
    ├── calculations.ts      # Financial calculations
    ├── transformers.ts      # Raw data → response transformers
    └── expense-metrics.ts   # Expense metrics with MoM comparison
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    getDashboardData()                        │
├─────────────────────────────────────────────────────────────┤
│  1. Authenticate user via Supabase                          │
│  2. Calculate date ranges (current month, previous month)   │
│  3. Parallel fetch all data (7 queries)                     │
│  4. Calculate derived metrics                               │
│  5. Transform and return response                           │
└─────────────────────────────────────────────────────────────┘
```

## Database Queries (Parallelized)

| Query           | Table                               | Purpose                     |
| --------------- | ----------------------------------- | --------------------------- |
| Expense Metrics | `transactions`, `recurring_charges` | MoM expense comparison      |
| Accounts        | `accounts`                          | All user financial accounts |
| Unreviewed      | `transactions`                      | Expenses without categories |
| Current Month   | `transactions`                      | This month's transactions   |
| Previous Month  | `transactions`                      | Last month's transactions   |
| Budgets         | `budgets`                           | Active category budgets     |
| Upcoming        | `recurring_charges`                 | Next 2 weeks recurring      |

## Response Structure

```typescript
{
  success: true,
  debug: { userId, userEmail },        // Remove in production
  expenseMetrics: {
    totalExpenses,                      // Sum of EXPENSE transactions
    interestPaid,                       // INTEREST_CHARGE transactions
    recurringCharges,                   // Recurring charges this month
    creditCardSpending,                 // Expenses on CREDIT_CARD accounts
    loanPayments,                       // LOAN_PAYMENT transactions
    *Change,                            // % change from previous month
  },
  accounts: [...],                      // All user accounts
  unreviewedTransactions: [...],        // Expenses needing categorization
  topCategories: [...],                 // Top 6 spending categories + budgets
  monthlyIncome,                        // This month's INCOME total
  monthlyExpenses,                      // This month's EXPENSE total
  previousMonthIncome,                  // Last month's INCOME total
  previousMonthExpenses,                // Last month's EXPENSE total
  upcomingRecurring: [...],             // Next 2 weeks recurring charges
}
```

## Key Business Logic

### Unreviewed Transactions

Transactions where `category_id IS NULL` and `type = 'EXPENSE'`. These need user attention to categorize.

### Month-over-Month Change

```
change = previous > 0
  ? ((current - previous) / previous) * 100
  : current > 0 ? 100 : 0
```

### Credit Card Spending

Only counts `EXPENSE` transactions where the linked account `type = 'CREDIT_CARD'`.

### Top Categories

1. Group expenses by category
2. Sum amounts per category
3. Match with active budgets
4. Sort by spending (descending)
5. Return top 6

### Upcoming Recurring

Recurring charges where `next_due_date` is between now and 14 days from now.

## Usage

```typescript
// In a server component or action
import { getDashboardData } from "@/actions/dashboard/get-dashboard-data";

const result = await getDashboardData();

if (result.success) {
  // Use result.accounts, result.expenseMetrics, etc.
} else {
  // Handle result.error
}
```

```typescript
// In a client component with React Query
import { useDashboard } from "@/hooks/use-dashboard";

function DashboardPage() {
  const { data, isLoading, error } = useDashboard();
  // ...
}
```

## Performance

- All independent queries run in parallel via `Promise.all`
- Typical response time: 100-300ms
- React Query caches for 5 minutes (configured in `use-dashboard.ts`)
