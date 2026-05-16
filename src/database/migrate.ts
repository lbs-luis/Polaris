import { SQLiteDatabase } from 'expo-sqlite';
import { CreateBankAccountsTable } from './tables/bank-accounts.table';
import { CreateCategoriesTable } from './tables/categories.table';
import { CreateInvoicesTable } from './tables/invoices.table';
import { CreateRecurrentsTable } from './tables/recurrents.table';
import { CreateSettingsTable } from './tables/settings.table';
import { CreateTransactionsTable } from './tables/transactions.table';

async function ensureColumn(
  database: SQLiteDatabase,
  table: string,
  column: string,
  definition: string
) {
  const cols = await database.getAllAsync<{ name: string }>(
    `PRAGMA table_info(${table})`
  );
  if (!cols.some((c) => c.name === column)) {
    await database.execAsync(
      `ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`
    );
  }
}

export async function migrate(database: SQLiteDatabase) {
  await database.execAsync(`
      PRAGMA foreign_key = ON;

      ${CreateSettingsTable}
      ${CreateCategoriesTable}
      ${CreateRecurrentsTable}
      ${CreateInvoicesTable}
      ${CreateTransactionsTable}
      ${CreateBankAccountsTable}
    `);

  await ensureColumn(database, 'categories', 'icon', 'TEXT');
  await ensureColumn(database, 'transactions', 'issued_at', 'TEXT');
}
