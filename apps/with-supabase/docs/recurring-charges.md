# Recurring Charges Data Fetching Strategy

This document outlines the optimized data fetching strategy used in the Recurring Charges feature to ensure fast page loads and a responsive user experience.

## Overview

The Recurring Charges page is designed to load quickly even for users with a large number of transactions. To achieve this, we use a **two-stage fetching strategy**:

1.  **Initial Load**: Fetch only the essential "basic" data for all recurring charges.
2.  **Lazy Load**: Fetch heavy transaction history only when a specific recurring charge is selected.

## Architecture

### 1. Basic Data Query (`useRecurringsBasic`)

**Action**: `actions/get-recurrings-basic-data.ts`

On initial page load, we fetch only the lightweight metadata for the list of recurring charges. This includes:

- Name, Amount, Frequency
- Next Due Date
- Associated Account (ID, Name, Type)
- Associated Category (ID, Name, Icon, Color)

**Crucially, this query DOES NOT include the transaction history.** This keeps the initial payload small (~KB instead of ~MB).

```typescript
// Example response shape
type RecurringBasicData = {
  id: string;
  name: string;
  amount: number;
  // ... other metadata
  account: { name: string; type: string };
  category: { name: string; icon: string; color: string };
  // NO transactions array here
};
```

### 2. Lazy Transaction Query (`useRecurringTransactions`)

**Action**: `actions/get-recurring-transactions.ts`

When a user selects a recurring charge from the list (or the first one is auto-selected), we trigger a separate query to fetch its specific transaction history.

- **Trigger**: Client-side state change (`selectedRecurringId`).
- **Optimization**: Uses React Query `enabled` option to only run when an ID is present.
- **Caching**: Transaction lists are cached (stale time: 5 mins) so switching back and forth is instant.

## Benefits

- **Fast Initial Paint**: The main UI skeleton and list appear almost immediately.
- **Reduced Database Load**: We don't join thousands of transaction rows for charges the user isn't looking at.
- **Scalability**: The page performance remains stable even as transaction history grows over years.
