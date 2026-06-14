import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';

interface IRecurrentsTUpdate {
  category_id: number;
  base_value: number;
  due_day: number;
  type: 'income' | 'outcome';
  /** User-facing label for the recurrence (e.g. "Aluguel"). */
  description?: string | null;
  concluded?: 0 | 1;
  /** Total number of installments. Null = open-ended (e.g. rent, streaming). */
  installments_total?: number | null;
  /**
   * Earliest month (YYYY-MM) the reconciler is allowed to fire for this row.
   * Defaults to null — meaning "no lower bound, fire whenever due". Set by
   * the same-day prompt so the reconciler doesn't retroactively insert a
   * transaction the user already decided to skip or already lançou manually.
   */
  first_fire_month?: string | null;
}

export interface IRecurrentsTRow {
  id: number;
  category_id: number;
  category_name: string;
  category_icon: string | null;
  description: string | null;
  base_value: number;
  due_day: number;
  type: 'income' | 'outcome';
  concluded: 0 | 1;
  installments_total: number | null;
  first_fire_month: string | null;
  updatedAt: string;
}

type IRecurrentsTSelect = IRecurrentsTRow | null;

export function useRecurrentsTable() {
  const database = useSQLiteContext();

  const set = useCallback(
    async (recurrent: IRecurrentsTUpdate): Promise<number> => {
      const result = await database.runAsync(
        `INSERT INTO recurrents (
          category_id, type, base_value, due_day, description,
          concluded, installments_total, first_fire_month, updatedAt
         )
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [
          recurrent.category_id,
          recurrent.type,
          recurrent.base_value,
          recurrent.due_day,
          recurrent.description ?? null,
          recurrent.concluded ?? 0,
          recurrent.installments_total ?? null,
          recurrent.first_fire_month ?? null,
        ]
      );
      return result.lastInsertRowId as number;
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
          description = ?,
          concluded = ?,
          installments_total = ?,
          first_fire_month = ?,
          updatedAt = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
          recurrent.category_id,
          recurrent.type,
          recurrent.base_value,
          recurrent.due_day,
          recurrent.description ?? null,
          recurrent.concluded ?? 0,
          recurrent.installments_total ?? null,
          recurrent.first_fire_month ?? null,
          id,
        ]
      );
    },
    [database]
  );

  /** Sets `concluded = 1` without touching anything else. */
  const conclude = useCallback(
    async (id: number) => {
      await database.runAsync(
        `UPDATE recurrents SET concluded = 1, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
        [id]
      );
    },
    [database]
  );

  /** Inverse of `conclude` — flips `concluded` back to 0. */
  const reopen = useCallback(
    async (id: number) => {
      await database.runAsync(
        `UPDATE recurrents SET concluded = 0, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
        [id]
      );
    },
    [database]
  );

  /** Bumps just the `first_fire_month` gate (used by the same-day prompt). */
  const setFirstFireMonth = useCallback(
    async (id: number, monthKey: string) => {
      await database.runAsync(
        `UPDATE recurrents SET first_fire_month = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
        [monthKey, id]
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

  /**
   * Lists recurrents with optional filters. By default returns only
   * non-concluded rows so the active "Recorrências" screen never has to
   * filter client-side. Pass `status: 'concluded'` for the concluded list,
   * or `status: 'all'` to bypass the gate (used by the reconciler).
   */
  const list = useCallback(
    async (opts?: {
      type?: 'income' | 'outcome';
      status?: 'active' | 'concluded' | 'all';
    }): Promise<IRecurrentsTRow[]> => {
      const status = opts?.status ?? 'active';
      const where: string[] = [];
      const params: (string | number)[] = [];
      if (opts?.type) {
        where.push('r.type = ?');
        params.push(opts.type);
      }
      if (status === 'active') where.push('r.concluded = 0');
      if (status === 'concluded') where.push('r.concluded = 1');
      const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
      return (await database.getAllAsync(
        `SELECT r.*, c.name as category_name, c.icon as category_icon
           FROM recurrents r
           JOIN categories c ON c.id = r.category_id
           ${whereSql}
           ORDER BY r.due_day ASC`,
        params
      )) as IRecurrentsTRow[];
    },
    [database]
  );

  return {
    set,
    update,
    select,
    exclude,
    list,
    conclude,
    reopen,
    setFirstFireMonth,
  };
}

export const CreateRecurrentsTable = `
  CREATE TABLE IF NOT EXISTS recurrents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    type TEXT NOT NULL CHECK(type IN ('income', 'outcome')),
    base_value INTEGER NOT NULL,
    due_day INTEGER NOT NULL CHECK(due_day BETWEEN 1 AND 31),
    description TEXT,
    concluded INTEGER NOT NULL DEFAULT 0,
    installments_total INTEGER,
    first_fire_month TEXT,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`;
