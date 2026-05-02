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
      return (await database.getFirstAsync(
        `SELECT * FROM categories WHERE name = ?`,
        [name]
      )) as ICategoriesTSelect;
    },
    [database]
  );

  const exclude = useCallback(
    async (name: string) => {
      await database.runAsync('DELETE FROM categories WHERE name = ?', [name]);
    },
    [database]
  );

  const list = useCallback(
    async (type?: 'income' | 'outcome'): Promise<ICategoriesTRow[]> => {
      const query = type
        ? 'SELECT * FROM categories WHERE type = ?'
        : 'SELECT * FROM categories';
      const params = type ? [type] : [];
      return (await database.getAllAsync(query, params)) as ICategoriesTRow[];
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
    updatedAt TIMESTAMP NOT NULL
  );
  INSERT OR IGNORE INTO categories (id, name, type, updatedAt) VALUES (1, 'Movimento Diário', 'outcome', CURRENT_TIMESTAMP);
`;