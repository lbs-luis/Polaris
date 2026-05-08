import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';

export interface ISettingsTUpdate {
  sKey: string;
  sValue: string;
}

export type ISettingsTRow = {
  id: number;
  sKey: string;
  sValue: string;
  updatedAt: string;
};

export function useSettingsTable() {
  const database = useSQLiteContext();

  const set = useCallback(
    async (settings: ISettingsTUpdate) => {
      await database.runAsync(
        `
      INSERT INTO settings (sKey, sValue, updatedAt)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(sKey) DO UPDATE SET
        sValue = excluded.sValue,
        updatedAt = CURRENT_TIMESTAMP
      `,
        [settings.sKey, settings.sValue]
      );
    },
    [database]
  );

  const select = useCallback(
    async (sKey: string): Promise<ISettingsTRow | null> => {
      return (await database.getFirstAsync(
        `SELECT * FROM settings WHERE sKey = ?`,
        [sKey]
      )) as ISettingsTRow | null;
    },
    [database]
  );

  return { set, select };
}

export const CreateSettingsTable = `
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sKey TEXT NOT NULL UNIQUE,
    sValue TEXT,
    updatedAt TIMESTAMP NOT NULL
  );
`;
