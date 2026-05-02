# Polaris — Invoice → Transaction Pipeline (Updated Plan)

## Key Changes From Previous Plan

1. **Default category "Movimento Diário"** seeded in `CreateCategoriesTable` with ID 1 alongside the CREATE TABLE statement.
2. **Transaction list does NOT join categories** — `list()` returns all columns from transactions table ordered by date most recent first. Display uses `due_day`, `description`, `value` directly from the transaction row.
3. Everything else remains the same.

---

## Step 1 — Seed Default Category in Categories Table

**File:** `src/database/tables/categories.table.ts`

Add an INSERT after the CREATE TABLE in `CreateCategoriesTable`:

```sql
CREATE TABLE IF NOT EXISTS categories (...);
INSERT OR IGNORE INTO categories (id, name, type, updatedAt) VALUES (1, 'Movimento Diário', 'outcome', CURRENT_TIMESTAMP);
```

This guarantees `category_id = 1` always exists and is "Movimento Diário". The `OR IGNORE` ensures it doesn't fail on re-runs.

---

## Step 2 — Update Transactions Table Schema

**File:** `src/database/tables/transactions.table.ts`

### Schema Changes

- `recurrent_id INTEGER` → **nullable** (remove `NOT NULL`)
- Add `due_day INTEGER`
- Add `description TEXT`
- Add `category_id INTEGER REFERENCES categories(id)`
- Remove `UNIQUE(recurrent_id, month, year)` constraint
- Keep `FOREIGN KEY (recurrent_id)` and `FOREIGN KEY (invoice_id)`
- Add `FOREIGN KEY (category_id) REFERENCES categories(id)`

New schema:

```sql
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recurrent_id INTEGER,
  value INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK(month BETWEEN 1 AND 12),
  year INTEGER NOT NULL,
  due_day INTEGER,
  description TEXT,
  category_id INTEGER REFERENCES categories(id),
  invoice_id TEXT REFERENCES invoices(chave_acesso) ON DELETE SET NULL,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recurrent_id) REFERENCES recurrents(id) ON DELETE CASCADE
);
```

### Interface Updates

```typescript
interface ITransactionsTUpdate {
  recurrent_id?: number | null;
  value: number;
  month: number;
  year: number;
  due_day?: number;
  description?: string;
  category_id?: number;
  invoice_id?: string | null;
}

export interface ITransactionsTRow {
  id: number;
  recurrent_id: number | null;
  value: number;
  month: number;
  year: number;
  due_day: number | null;
  description: string | null;
  category_id: number | null;
  invoice_id: string | null;
  updatedAt: string;
}
```

### Updated `set()` method

Remove the `ON CONFLICT` clause since we removed the UNIQUE constraint. Simple INSERT:

```sql
INSERT INTO transactions (recurrent_id, value, month, year, due_day, description, category_id, invoice_id, updatedAt)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
```

### Updated `list()` method

Simple query, no JOIN, ordered by most recent first:

```sql
SELECT * FROM transactions ORDER BY year DESC, month DESC, due_day DESC
```

Remove the `month` and `year` parameters — list returns all transactions.

Or keep them optional for filtering. User said "list all registers ordered by date from recent to older" so let's default to all.

---

## Step 3 — Update Invoice Processor to Create Transactions

**File:** `src/hooks/use-invoice-processor.ts`

Changes:

1. Import `useTransactionsTable` and `useCategoriesTable`
2. After saving each invoice, create a transaction:

   ```typescript
   // Parse issued_at (format: "dd/MM/yyyy HH:mm:ss") → extract day, month, year
   const dateParts = invoice.issued_at.match(/(\d{2})\/(\d{2})\/(\d{4})/);
   const day = dateParts ? parseInt(dateParts[1]) : new Date().getDate();
   const month = dateParts ? parseInt(dateParts[2]) : new Date().getMonth() + 1;
   const year = dateParts ? parseInt(dateParts[3]) : new Date().getFullYear();

   await setTransaction({
     value: invoice.total_value,
     month,
     year,
     due_day: day,
     description: invoice.establishment_name,
     category_id: 1, // "Movimento Diário"
     invoice_id: invoice.chave_acesso,
   });
   ```

3. Store `items` as `JSON.stringify(invoice.items)` instead of `'[]'`

---

## Step 4 — Update Home Screen Display

**File:** `src/app/home/index.tsx`

- `list()` now takes no params (or optional filter) and returns transactions ordered by date
- Display format: **`due_day · description · R$ value`**
- Refresh list when `state.status === 'done'`

Updated list call:

```typescript
const { list } = useTransactionsTable();
// ...
useEffect(() => {
  list().then(setTransactions);
}, [list]);

// Refresh after invoice processing
useEffect(() => {
  if (state.status === 'done') {
    list().then(setTransactions);
  }
}, [state.status, list]);
```

Transaction display:

```tsx
<View className="mb-3 flex flex-row items-center justify-between rounded-xl bg-surface-secondary p-4">
  <View className="flex flex-1 flex-row items-center gap-3">
    <Text className="text-sm font-medium text-text-secondary">{t.due_day}</Text>
    <Text className="flex-1 text-base font-medium text-text-primary">
      {t.description || 'Transação'}
    </Text>
  </View>
  <Text className="text-base font-semibold text-text-primary">
    R$ {(t.value / 100).toFixed(2).replace('.', ',')}
  </Text>
</View>
```

---

## Step 5 — Update Migration (if needed)

**File:** `src/database/migrate.ts`

No structural changes needed — the `CREATE TABLE IF NOT EXISTS` statements handle fresh installs. The categories seed INSERT is inside `CreateCategoriesTable` now.

For existing dev installs, clearing app data is fine (app is unreleased).

---

## Files Changed Summary

| File                                        | Changes                                                                                                                |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `src/database/tables/categories.table.ts`   | Add seed INSERT for "Movimento Diário" id=1                                                                            |
| `src/database/tables/transactions.table.ts` | Nullable recurrent_id, add due_day/description/category_id, remove UNIQUE, update list() to return all ordered by date |
| `src/hooks/use-invoice-processor.ts`        | Create transaction after invoice, use category_id=1, parse date from issued_at, store items as JSON                    |
| `src/app/home/index.tsx`                    | Update transaction display format, refresh after processing done, list() without params                                |

## Verification

- [ ] `npx tsc --noEmit` passes
- [ ] Category "Movimento Diário" exists with id=1 after fresh DB init
- [ ] Invoice scan creates both invoice row AND transaction row
- [ ] Transaction appears on home: `due_day · description · R$ value`
- [ ] Home screen refreshes after processing completes
- [ ] Items stored as JSON in invoice table
