import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';

interface ITransactionsTUpdate {
  recurrent_id?: number | null;
  value: number;
  month: number;
  year: number;
  due_day?: number;
  description?: string;
  category_id?: number;
  invoice_id?: string | null;
  /** ISO datetime (YYYY-MM-DDTHH:MM:SS) for invoice-imported rows. */
  issued_at?: string | null;
}

export interface ITransactionsTRow {
  id: number;
  recurrent_id: number | null;
  value: number;
  month: number;
  year: number;
  due_day: number | null;
  description: string | null;
  category_id: number | null;
  category_name: string | null;
  category_icon: string | null;
  category_type: 'income' | 'outcome' | null;
  invoice_id: string | null;
  issued_at: string | null;
  updatedAt: string;
}

type ITransactionsTSelect = ITransactionsTRow | null;

export function useTransactionsTable() {
  const database = useSQLiteContext();

  const set = useCallback(
    async (transaction: ITransactionsTUpdate) => {
      await database.runAsync(
        `INSERT INTO transactions (recurrent_id, value, month, year, due_day, description, category_id, invoice_id, issued_at, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [
          transaction.recurrent_id ?? null,
          transaction.value,
          transaction.month,
          transaction.year,
          transaction.due_day ?? null,
          transaction.description ?? null,
          transaction.category_id ?? null,
          transaction.invoice_id ?? null,
          transaction.issued_at ?? null,
        ]
      );
    },
    [database]
  );

  const select = useCallback(
    async (id: number): Promise<ITransactionsTSelect> => {
      return (await database.getFirstAsync(
        `SELECT * FROM transactions WHERE id = ?`,
        [id]
      )) as ITransactionsTSelect;
    },
    [database]
  );

  const selectByMonth = useCallback(
    async (
      recurrent_id: number,
      month: number,
      year: number
    ): Promise<ITransactionsTSelect> => {
      return (await database.getFirstAsync(
        `SELECT * FROM transactions WHERE recurrent_id = ? AND month = ? AND year = ?`,
        [recurrent_id, month, year]
      )) as ITransactionsTSelect;
    },
    [database]
  );

  const exclude = useCallback(
    async (id: number) => {
      await database.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
    },
    [database]
  );

  const update = useCallback(
    async (
      id: number,
      partial: {
        value?: number;
        description?: string | null;
        category_id?: number;
        due_day?: number;
        month?: number;
        year?: number;
      }
    ) => {
      const fields: string[] = [];
      const params: (string | number | null)[] = [];
      if (partial.value !== undefined) {
        fields.push('value = ?');
        params.push(partial.value);
      }
      if (partial.description !== undefined) {
        fields.push('description = ?');
        params.push(partial.description);
      }
      if (partial.category_id !== undefined) {
        fields.push('category_id = ?');
        params.push(partial.category_id);
      }
      if (partial.due_day !== undefined) {
        fields.push('due_day = ?');
        params.push(partial.due_day);
      }
      if (partial.month !== undefined) {
        fields.push('month = ?');
        params.push(partial.month);
      }
      if (partial.year !== undefined) {
        fields.push('year = ?');
        params.push(partial.year);
      }
      if (fields.length === 0) return;
      fields.push('updatedAt = CURRENT_TIMESTAMP');
      params.push(id);
      await database.runAsync(
        `UPDATE transactions SET ${fields.join(', ')} WHERE id = ?`,
        params
      );
    },
    [database]
  );

  const countByRecurrent = useCallback(
    async (recurrent_id: number): Promise<number> => {
      const row = await database.getFirstAsync<{ n: number }>(
        `SELECT COUNT(*) AS n FROM transactions WHERE recurrent_id = ?`,
        [recurrent_id]
      );
      return row?.n ?? 0;
    },
    [database]
  );

  /**
   * Returns the most-recent transaction with a matching description, or null
   * when there is none. Used by the invoice processor as a "learned default
   * category" fallback — if the same merchant has been seen before, reuse
   * whatever category the user has assigned (manually or automatically) to
   * the latest entry instead of always landing on the catch-all category.
   */
  const lastByDescription = useCallback(
    async (description: string): Promise<ITransactionsTRow | null> => {
      return (await database.getFirstAsync(
        `SELECT t.*,
                c.name AS category_name,
                c.icon AS category_icon,
                c.type AS category_type
           FROM transactions t
           LEFT JOIN categories c ON c.id = t.category_id
          WHERE t.description = ?
          ORDER BY t.issued_at DESC,
                   t.year DESC, t.month DESC, t.due_day DESC,
                   t.id DESC
          LIMIT 1`,
        [description]
      )) as ITransactionsTRow | null;
    },
    [database]
  );

  const list = useCallback(async (): Promise<ITransactionsTRow[]> => {
    return (await database.getAllAsync(
      `SELECT t.*,
              c.name AS category_name,
              c.icon AS category_icon,
              c.type AS category_type
         FROM transactions t
         LEFT JOIN categories c ON c.id = t.category_id
         ORDER BY t.issued_at DESC,
                  t.year DESC, t.month DESC, t.due_day DESC,
                  t.id DESC`
    )) as ITransactionsTRow[];
  }, [database]);

  return {
    set,
    select,
    selectByMonth,
    exclude,
    list,
    update,
    countByRecurrent,
    lastByDescription,
  };
}

export const CreateTransactionsTable = `
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recurrent_id INTEGER,
    value INTEGER NOT NULL,
    month INTEGER NOT NULL CHECK(month BETWEEN 1 AND 12),
    year INTEGER NOT NULL,
    due_day INTEGER,
    description TEXT,
    category_id INTEGER REFERENCES categories(id),
    invoice_id TEXT REFERENCES invoices(key) ON DELETE SET NULL,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recurrent_id) REFERENCES recurrents(id) ON DELETE CASCADE
  );
`;
