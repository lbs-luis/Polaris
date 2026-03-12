import { SQLiteDatabase } from 'expo-sqlite';
import { CreateSettingsTable } from './tables/settings.table';

export async function migrate(database: SQLiteDatabase) {
  return await database.execAsync(`
      PRAGMA foreign_key = ON;

      ${CreateSettingsTable}
    `);
}
