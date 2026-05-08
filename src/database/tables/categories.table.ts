import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';

interface ICategoriesTUpdate {
  name: string;
  type: 'income' | 'outcome';
}

export type ICategoriesTRow = {
  id: number;
  name: string;
  type: 'income' | 'outcome';
  isDefault: boolean;
  updatedAt: string;
};

type ICategoriesTSelect = ICategoriesTRow | null;

export function useCategoriesTable() {
  const database = useSQLiteContext();

  const set = useCallback(
    async (category: ICategoriesTUpdate) => {
      await database.runAsync(
        `INSERT INTO categories (name, type, updatedAt)
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(name) DO UPDATE SET
         name = excluded.name,
         type = excluded.type,
         updatedAt = CURRENT_TIMESTAMP`,
        [category.name, category.type]
      );
    },
    [database]
  );

  const select = useCallback(
    async (name: string): Promise<ICategoriesTSelect> => {
      const row = await database.getFirstAsync<any>(
        `SELECT * FROM categories WHERE name = ?`,
        [name]
      );
      if (!row) return null;
      return { ...row, isDefault: row.isDefault === 1 } as ICategoriesTSelect;
    },
    [database]
  );

  const exclude = useCallback(
    async (name: string) => {
      await database.runAsync(
        'DELETE FROM categories WHERE name = ? AND isDefault = 0',
        [name]
      );
    },
    [database]
  );

  const list = useCallback(
    async (type?: 'income' | 'outcome'): Promise<ICategoriesTRow[]> => {
      const query = type
        ? 'SELECT * FROM categories WHERE type = ?'
        : 'SELECT * FROM categories';
      const params = type ? [type] : [];
      const rows = (await database.getAllAsync(query, params)) as any[];
      return rows.map((row) => ({ ...row, isDefault: row.isDefault === 1 }));
    },
    [database]
  );

  return { set, select, exclude, list };
}

export const CreateCategoriesTable = `
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK(type IN ('income', 'outcome')),
    isDefault INTEGER NOT NULL DEFAULT 0,
    updatedAt TIMESTAMP NOT NULL
  );
  INSERT OR IGNORE INTO categories (id, name, type, isDefault, updatedAt) VALUES (1, 'Movimento Diário', 'outcome', 1, CURRENT_TIMESTAMP);
`;
