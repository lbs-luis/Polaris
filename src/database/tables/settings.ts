import * as SQLite from 'expo-sqlite';

export const SETTINGS_TABLE = `
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
  );
`;

export interface SettingRecord {
  id?: number;
  key: string;
  value: string;
  created_at?: number;
  updated_at?: number;
}

export const DEFAULT_SETTINGS = [{ key: 'onboarding_status', value: 'false' }];

export async function createSettingsTable(
  db: SQLite.SQLiteDatabase,
): Promise<void> {
  try {
    await db.execAsync(SETTINGS_TABLE);

    await db.runAsync(`
      INSERT OR IGNORE INTO settings (key, value) VALUES
      ('onboarding_status', 'false')
    `);

    console.info('Settings table created and initialized');
  } catch (error: unknown) {
    console.error('Error creating settings table:', error);
    throw error;
  }
}
