import * as SQLite from 'expo-sqlite';
import { createSettingsTable } from './tables/settings';

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) {
    return db;
  }

  try {
    db = await SQLite.openDatabaseAsync('polaris.db');
    console.info('Database opened successfully');

    await createSettingsTable(db);

    console.info('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export function useDatabase() {
  return async (
    query: string,
    params: SQLite.SQLiteBindValue[] = [],
  ): Promise<unknown> => {
    const database = await initDatabase();

    try {
      const queryLower = query.trim().toLowerCase();

      if (queryLower.startsWith('select')) {
        if (query.includes('LIMIT 1')) {
          return await database.getFirstAsync(query, params);
        } else {
          return await database.getAllAsync(query, params);
        }
      } else if (
        queryLower.startsWith('insert') ||
        queryLower.startsWith('update') ||
        queryLower.startsWith('delete')
      ) {
        return await database.runAsync(query, params);
      } else {
        return await database.execAsync(query);
      }
    } catch (error: unknown) {
      console.error('Database query error:', error);
      throw error;
    }
  };
}
