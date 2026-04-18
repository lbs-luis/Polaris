import { useSQLiteContext } from 'expo-sqlite';

interface IRecurrentsTUpdate {
  category_name: string;
  base_value: number;
  due_day: number;
  type: 'income' | 'outcome';
}

export interface IRecurrentsTRow {
  id: number;
  category_name: string;
  base_value: number;
  due_day: number;
  type: 'income' | 'outcome';
  updatedAt: string;
}

type IRecurrentsTSelect = IRecurrentsTRow | null;

export function useRecurrentsTable() {
  const database = useSQLiteContext();

  async function set(recurrent: IRecurrentsTUpdate) {
    await database.runAsync(
      `
    INSERT INTO recurrents (category_name, type, base_value, due_day, updatedAt)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `,
      [
        recurrent.category_name,
        recurrent.type,
        recurrent.base_value,
        recurrent.due_day,
      ]
    );
  }

  async function update(id: number, recurrent: IRecurrentsTUpdate) {
    await database.runAsync(
      `
    UPDATE recurrents SET
      category_name = ?,
      type = ?,
      base_value = ?,
      due_day = ?,
      updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
      [
        recurrent.category_name,
        recurrent.type,
        recurrent.base_value,
        recurrent.due_day,
        id,
      ]
    );
  }

  async function select(id: number): Promise<IRecurrentsTSelect> {
    return (await database.getFirstAsync(
      `SELECT * FROM recurrents WHERE id = ?`,
      [id]
    )) as IRecurrentsTSelect;
  }

  async function exclude(id: number) {
    await database.runAsync('DELETE FROM recurrents WHERE id = ?', [id]);
  }

  async function list(type?: 'income' | 'outcome'): Promise<IRecurrentsTRow[]> {
    const query = type
      ? 'SELECT * FROM recurrents WHERE type = ?'
      : 'SELECT * FROM recurrents';
    const params = type ? [type] : [];
    return (await database.getAllAsync(query, params)) as IRecurrentsTRow[];
  }

  return { set, select, list, exclude, update };
}

export const CreateRecurrentsTable = `
  CREATE TABLE IF NOT EXISTS recurrents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('income', 'outcome')),
    base_value INTEGER NOT NULL,
    due_day INTEGER NOT NULL CHECK(due_day BETWEEN 1 AND 31),
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`;
