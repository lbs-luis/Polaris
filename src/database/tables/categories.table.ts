import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';

interface ICategoriesTUpdate {
  name: string;
  type: 'income' | 'outcome';
  icon?: string | null;
}

export type ICategoriesTRow = {
  id: number;
  name: string;
  type: 'income' | 'outcome';
  icon: string | null;
  isDefault: boolean;
  updatedAt: string;
};

type ICategoriesTSelect = ICategoriesTRow | null;

interface ICategoriesRawRow {
  id: number;
  name: string;
  type: 'income' | 'outcome';
  icon: string | null;
  isDefault: number;
  updatedAt: string;
}

function normalize(row: ICategoriesRawRow): ICategoriesTRow {
  return { ...row, isDefault: row.isDefault === 1 };
}

export function useCategoriesTable() {
  const database = useSQLiteContext();

  const set = useCallback(
    async (category: ICategoriesTUpdate) => {
      await database.runAsync(
        `INSERT INTO categories (name, type, icon, updatedAt)
       VALUES (?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(name) DO UPDATE SET
         name = excluded.name,
         type = excluded.type,
         icon = excluded.icon,
         updatedAt = CURRENT_TIMESTAMP`,
        [category.name, category.type, category.icon ?? null]
      );
    },
    [database]
  );

  const select = useCallback(
    async (name: string): Promise<ICategoriesTSelect> => {
      const row = await database.getFirstAsync<ICategoriesRawRow>(
        `SELECT * FROM categories WHERE name = ?`,
        [name]
      );
      return row ? normalize(row) : null;
    },
    [database]
  );

  const update = useCallback(
    async (id: number, category: ICategoriesTUpdate) => {
      await database.runAsync(
        `UPDATE categories SET
          name = ?, type = ?, icon = ?, updatedAt = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [category.name, category.type, category.icon ?? null, id]
      );
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
      const rows = (await database.getAllAsync(
        query,
        params
      )) as ICategoriesRawRow[];
      return rows.map(normalize);
    },
    [database]
  );

  return { set, update, select, exclude, list };
}

export const CreateCategoriesTable = `
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK(type IN ('income', 'outcome')),
    icon TEXT,
    isDefault INTEGER NOT NULL DEFAULT 0,
    updatedAt TIMESTAMP NOT NULL
  );
  INSERT OR IGNORE INTO categories (id, name, type, icon, isDefault, updatedAt) VALUES (1, 'Movimento Diário', 'outcome', NULL, 1, CURRENT_TIMESTAMP);
  INSERT OR IGNORE INTO categories (name, type, icon, isDefault, updatedAt) VALUES ('Mercado', 'outcome', 'food', 1, CURRENT_TIMESTAMP);
  INSERT OR IGNORE INTO categories (name, type, icon, isDefault, updatedAt) VALUES ('Restaurante', 'outcome', 'food', 1, CURRENT_TIMESTAMP);
  INSERT OR IGNORE INTO categories (name, type, icon, isDefault, updatedAt) VALUES ('Farmácia', 'outcome', 'health', 1, CURRENT_TIMESTAMP);
  INSERT OR IGNORE INTO categories (name, type, icon, isDefault, updatedAt) VALUES ('Combustível', 'outcome', 'trans', 1, CURRENT_TIMESTAMP);
  INSERT OR IGNORE INTO categories (name, type, icon, isDefault, updatedAt) VALUES ('Transporte', 'outcome', 'trans', 1, CURRENT_TIMESTAMP);
  INSERT OR IGNORE INTO categories (name, type, icon, isDefault, updatedAt) VALUES ('Compras', 'outcome', 'shop', 1, CURRENT_TIMESTAMP);
  INSERT OR IGNORE INTO categories (name, type, icon, isDefault, updatedAt) VALUES ('Saúde', 'outcome', 'health', 1, CURRENT_TIMESTAMP);
  INSERT OR IGNORE INTO categories (name, type, icon, isDefault, updatedAt) VALUES ('Lazer', 'outcome', 'fun', 1, CURRENT_TIMESTAMP);
  INSERT OR IGNORE INTO categories (name, type, icon, isDefault, updatedAt) VALUES ('Educação', 'outcome', 'edu', 1, CURRENT_TIMESTAMP);
  INSERT OR IGNORE INTO categories (name, type, icon, isDefault, updatedAt) VALUES ('Outros', 'outcome', 'shop', 1, CURRENT_TIMESTAMP);
`;
