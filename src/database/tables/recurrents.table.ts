import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';

interface IRecurrentsTUpdate {
  category_id: number;
  base_value: number;
  due_day: number;
  type: 'income' | 'outcome';
}

export interface IRecurrentsTRow {
  id: number;
  category_id: number;
  category_name: string;
  category_icon: string | null;
  base_value: number;
  due_day: number;
  type: 'income' | 'outcome';
  updatedAt: string;
}

type IRecurrentsTSelect = IRecurrentsTRow | null;

export function useRecurrentsTable() {
  const database = useSQLiteContext();

  const set = useCallback(
    async (recurrent: IRecurrentsTUpdate) => {
      await database.runAsync(
        `INSERT INTO recurrents (category_id, type, base_value, due_day, updatedAt)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [
          recurrent.category_id,
          recurrent.type,
          recurrent.base_value,
          recurrent.due_day,
        ]
      );
    },
    [database]
  );

  const update = useCallback(
    async (id: number, recurrent: IRecurrentsTUpdate) => {
      await database.runAsync(
        `UPDATE recurrents SET
        category_id = ?,
        type = ?,
        base_value = ?,
        due_day = ?,
        updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
        [
          recurrent.category_id,
          recurrent.type,
          recurrent.base_value,
          recurrent.due_day,
          id,
        ]
      );
    },
    [database]
  );

  const select = useCallback(
    async (id: number): Promise<IRecurrentsTSelect> => {
      return (await database.getFirstAsync(
        `SELECT r.*, c.name as category_name, c.icon as category_icon
       FROM recurrents r
       JOIN categories c ON c.id = r.category_id
       WHERE r.id = ?`,
        [id]
      )) as IRecurrentsTSelect;
    },
    [database]
  );

  const exclude = useCallback(
    async (id: number) => {
      await database.runAsync('DELETE FROM recurrents WHERE id = ?', [id]);
    },
    [database]
  );

  const list = useCallback(
    async (type?: 'income' | 'outcome'): Promise<IRecurrentsTRow[]> => {
      const query = type
        ? `SELECT r.*, c.name as category_name, c.icon as category_icon
         FROM recurrents r
         JOIN categories c ON c.id = r.category_id
         WHERE r.type = ?
         ORDER BY r.due_day ASC`
        : `SELECT r.*, c.name as category_name, c.icon as category_icon
         FROM recurrents r
         JOIN categories c ON c.id = r.category_id
         ORDER BY r.due_day ASC`;

      const params = type ? [type] : [];
      return (await database.getAllAsync(query, params)) as IRecurrentsTRow[];
    },
    [database]
  );

  return { set, update, select, exclude, list };
}

export const CreateRecurrentsTable = `
  CREATE TABLE IF NOT EXISTS recurrents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    type TEXT NOT NULL CHECK(type IN ('income', 'outcome')),
    base_value INTEGER NOT NULL,
    due_day INTEGER NOT NULL CHECK(due_day BETWEEN 1 AND 31),
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`;
