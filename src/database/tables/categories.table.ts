import { useSQLiteContext } from 'expo-sqlite';

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

  async function set(category: ICategoriesTUpdate) {
    await database.runAsync(
      `
      INSERT INTO categories (name, type, updatedAt)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(name) DO UPDATE SET
        name = excluded.name,
        type = excluded.type,
        updatedAt = CURRENT_TIMESTAMP
      `,
      [category.name, category.type]
    );
  }

  async function select(name: string): Promise<ICategoriesTSelect> {
    return (await database.getFirstAsync(
      `SELECT * FROM categories WHERE name = ?`,
      [name]
    )) as ICategoriesTSelect;
  }

  async function list(type?: 'income' | 'outcome'): Promise<ICategoriesTRow[]> {
    const query = type
      ? 'SELECT * FROM categories WHERE type = ?'
      : 'SELECT * FROM categories';

    const params = type ? [type] : [];

    return (await database.getAllAsync(query, params)) as ICategoriesTRow[];
  }

  return { set, select, list };
}

export const CreateCategoriesTable = `
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK(type IN ('income', 'outcome')),
    updatedAt TIMESTAMP NOT NULL
  );
`;
