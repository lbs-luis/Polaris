import { SQLiteDatabase } from 'expo-sqlite';
import { CreateCategoriesTable } from './tables/categories.table';
import { CreateRecurrentsTable } from './tables/recurrents.table';
import { CreateSettingsTable } from './tables/settings.table';
import { CreateTransactionsTable } from './tables/transactions.table';

export async function migrate(database: SQLiteDatabase) {
  return await database.execAsync(`
      PRAGMA foreign_key = ON;

      ${CreateSettingsTable}
      ${CreateCategoriesTable}
      ${CreateRecurrentsTable}
      ${CreateTransactionsTable}
    `);
}
