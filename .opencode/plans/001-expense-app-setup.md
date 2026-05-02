# Polaris Expense App — Implementation Plan

## Context

React Native app with Expo, SQLite via `expo-sqlite`, NativeWind, and file-based routing (`expo-router`).
Database tables are in `@src/database/tables/` and migration is a single `migrate.ts` script.

## Goals

1. Add `invoices` table to support NF-e QR scan workflow.
2. Update `transactions` table to link to invoices.
3. Update migration script.
4. Componentize the calendar from `_income.step.tsx` and reuse in `_outcome.step.tsx`.
5. Create `_outcome.step.tsx` (mirror of income step for outcome type).
6. Update `RecurrenceDrawer` to accept a `type` prop for reuse in both steps.
7. Add onboarding completion gate using `settings` table.
8. Create a simple `home` screen to land after onboarding.
9. Keep QR code NFe scanning as a future TODO item.

---

## Steps

### 1. Componentize the Calendar

**New file:** `src/components/onboarding/calendar-step.tsx`

- Extract the calendar UI from `_income.step.tsx` into a reusable component.
- Props:
  - `title: string`
  - `description: string`
  - `type: 'income' | 'outcome'`
  - `onNextStep: () => void`
- Uses `useCalendarConstructor()` internally.
- Uses a new generic view-model hook `useRecurrenceStep(type)` (see Step 2) to load registries and categories.
- Renders `StepHeader`, calendar grid with registry dots, registry list, `StepConfirmButton`, and `RecurrenceDrawer`.
- Styling remains identical to current income step.

### 2. Create generic view-model hook

**New file:** `src/hooks/view-models/use-recurrence-step.tsx`

- Replaces the type-specific `useIncomeStep` and future `useOutcomeStep`.
- Accepts `type: 'income' | 'outcome'` as argument.
- Returns `{ registries, categories, isLoading, refresh }`.
- Internally calls `listRecurrents(type)` and `listCategories(type)`.

### 3. Update `RecurrenceDrawer` to accept `type` prop

**File:** `src/components/onboarding/recurrence/recurrence-drawer.tsx`

- Add `type: 'income' | 'outcome'` to props.
- Use the prop in `handleSave` instead of hardcoded `'income'`.

### 4. Refactor `_income.step.tsx` to use `CalendarStep`

**File:** `src/app/onboarding/(steps)/_income.step.tsx`

- Replace all inline calendar logic with `<CalendarStep title="Receitas" description="Registre seus ganhos recorrentes." type="income" onNextStep={onNextStep} />`.

### 5. Create `_outcome.step.tsx`

**File:** `src/app/onboarding/(steps)/_outcome.step.tsx`

- Uses `<CalendarStep title="Despesas" description="Registre seus gastos recorrentes." type="outcome" onNextStep={onNextStep} />`.

### 6. Create `invoices` table and hook

**File:** `src/database/tables/invoices.table.ts`

- Schema matches design doc exactly:
  - `chave_acesso TEXT PRIMARY KEY`
  - `establishment_name TEXT`, `cnpj TEXT`, `issued_at TEXT`
  - `total_value INTEGER`, `tax_icms INTEGER`, `tax_iof INTEGER`, `tax_pis INTEGER`, `tax_cofins INTEGER`, `tax_others INTEGER`
  - `items TEXT` (JSON array)
  - `qrcode_url TEXT`, `raw_html TEXT`
  - `scanned_at TIMESTAMP`
- Hook: `useInvoicesTable()` with `set`, `select`, `list`, `exclude`.
- `set` uses `INSERT OR IGNORE` to silently skip duplicate scans.
- Export shared `InvoiceItem` interface and `CreateInvoicesTable` SQL string.

### 7. Update `transactions` table

**File:** `src/database/tables/transactions.table.ts`

- Add `invoice_id TEXT` nullable column.
- Add `FOREIGN KEY (invoice_id) REFERENCES invoices(chave_acesso) ON DELETE SET NULL`.
- Update `ITransactionsTUpdate` and `ITransactionsTRow` to include optional `invoice_id`.
- Update `set()` to accept `invoice_id`.
- Keep existing `ON CONFLICT(recurrent_id, month, year) DO UPDATE` behavior.

### 8. Update migration script

**File:** `src/database/migrate.ts`

- Import `CreateInvoicesTable`.
- Add it to the `execAsync` sequence.

### 9. Create simple `home` screen

**File:** `src/app/home/index.tsx`

- Basic placeholder screen.
- Displays a header and a simple list of transactions using `useTransactionsTable().list()`.
- Uses NativeWind styling consistent with the app (`bg-app-bg`, `text-white`, etc.).
- Include a button or link to navigate to a future "recurrencies" screen (placeholder).

### 10. Onboarding completion gate

**File:** `src/app/onboarding/(steps)/_outcome.step.tsx` (or `index.tsx`)

- On final step completion, call `useSettingsTable().set({ sKey: 'onboarding_complete', sValue: 'true' })`.
- Then call `onNextStep()` which will redirect to `/home`.

**File:** `src/app/index.tsx`

- Read `onboarding_complete` setting on mount using `useSettingsTable().select('onboarding_complete')`.
- If `'true'` → `<Redirect href={'/home'} />`
- Otherwise → `<Redirect href={'/onboarding'} />`

### 11. Future TODO — QR Code NFe Scanning

- Add camera permission and QR code scanning capability.
- Parse `chave_acesso` from QR URL.
- Fetch SEFAZ page and parse establishment, totals, taxes, items.
- Save invoice via `useInvoicesTable().set()`.
- Link invoice to current transaction.
- Handle duplicate scans (INSERT OR IGNORE) and offline scenarios (save `qrcode_url` locally, retry on next open).

---

## Verification

- Run `npx tsc --noEmit` (or Expo start) to check for TypeScript errors.
- Verify database initialization compiles.
- Ensure no runtime crashes on app launch.
- Check that income and outcome onboarding steps render correctly with shared calendar component.
- Confirm onboarding gate redirects to home after completion and to onboarding on fresh install.
