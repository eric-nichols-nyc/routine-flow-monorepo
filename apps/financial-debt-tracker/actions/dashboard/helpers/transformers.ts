/**
 * Data transformation functions for dashboard response
 */

import type {
  Account,
  UnreviewedTransaction,
  UpcomingRecurring,
} from "../types";

type RawAccount = {
  id: string;
  name: string;
  type: string;
  balance: number | string;
  credit_limit?: number | string | null;
};

type RawTransaction = {
  id: string;
  amount: number | string;
  description: string | null;
  date: string;
  type: string;
  accounts: { name: string } | { name: string }[];
  categories?:
    | { name: string; color: string | null }
    | { name: string; color: string | null }[]
    | null;
};

type RawRecurringCharge = {
  id: string;
  name: string;
  amount: number | string;
  frequency: string;
  next_due_date: string;
  accounts: { name: string } | { name: string }[];
  categories: { name: string } | { name: string }[];
};

/**
 * Extract name from Supabase join result (handles both single object and array)
 */
function extractName(data: { name: string } | { name: string }[]): string {
  if (Array.isArray(data)) {
    return data[0]?.name ?? "";
  }
  return data.name;
}

/**
 * Extract category data from Supabase join result
 */
function extractCategory(
  data:
    | { name: string; color: string | null }
    | { name: string; color: string | null }[]
    | null
    | undefined,
): { name: string; color: string | null } | null {
  if (!data) return null;
  if (Array.isArray(data)) {
    return data[0] ?? null;
  }
  return data;
}

/**
 * Transform raw account data to response format
 */
export function transformAccounts(accounts: RawAccount[]): Account[] {
  return accounts.map((a) => ({
    id: a.id,
    name: a.name,
    type: a.type,
    balance: Number(a.balance),
    credit_limit: a.credit_limit ? Number(a.credit_limit) : undefined,
  }));
}

/**
 * Transform raw transaction data to unreviewed transaction format
 */
export function transformUnreviewedTransactions(
  transactions: RawTransaction[],
): UnreviewedTransaction[] {
  return transactions.map((t) => {
    const category = extractCategory(t.categories);
    return {
      id: t.id,
      amount: Number(t.amount),
      description: t.description,
      date: t.date,
      type: t.type,
      account: {
        name: extractName(t.accounts),
      },
      category: category
        ? {
            name: category.name,
            color: category.color,
          }
        : null,
    };
  });
}

/**
 * Transform raw recurring charge data to response format
 */
export function transformUpcomingRecurring(
  charges: RawRecurringCharge[],
): UpcomingRecurring[] {
  return charges.map((r) => ({
    id: r.id,
    name: r.name,
    amount: Number(r.amount),
    frequency: r.frequency,
    next_due_date: r.next_due_date,
    account: {
      name: extractName(r.accounts),
    },
    category: {
      name: extractName(r.categories),
    },
  }));
}
