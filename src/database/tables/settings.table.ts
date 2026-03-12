import { useSQLiteContext } from 'expo-sqlite';

export interface ISettingsTUpdate {
  sKey: string;
  sValue: string;
}

export type ISettingsTRow = {
  id: number;
  sKey: string;
  sValue: string;
  updateAt: string;
};

export type ISettingsTSelect = Array<ISettingsTRow>;

export function useSettingsTable() {
  const database = useSQLiteContext();

  async function insert(settings: ISettingsTUpdate) {
    const duplicated = (await database.getFirstAsync(
      `SELECT * FROM settings WHERE sKey = ?`,
      [settings.sKey]
    )) as ISettingsTRow;

    if (duplicated) return;

    await database.runAsync(
      'INSERT INTO settings (sKey, sValue, updateAt) VALUES (?, ?, CURRENT_TIMESTAMP)',
      [settings.sKey, settings.sValue]
    );
  }

  async function selectWhere(sKey: string): Promise<ISettingsTSelect> {
    return (await database.getAllAsync(
      `SELECT * FROM settings WHERE sKey = ?`,
      [sKey]
    )) as ISettingsTSelect;
  }

  async function update(settings: ISettingsTUpdate) {
    const duplicated = (await database.getFirstAsync(
      `SELECT * FROM settings WHERE sKey = ?`,
      [settings.sKey]
    )) as ISettingsTRow;

    if (!duplicated) return;

    await database.runAsync(
      'UPDATE settings SET sValue = ?, updateAt = CURRENT_TIMESTAMP WHERE sKey = ?',
      [settings.sValue, settings.sKey]
    );
  }

  return { insert, selectWhere, update };
}

export const CreateSettingsTable = `
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sKey TEXT NOT NULL UNIQUE,
    sValue TEXT,
    updateAt TIMESTAMP NOT NULL
  );
`;
