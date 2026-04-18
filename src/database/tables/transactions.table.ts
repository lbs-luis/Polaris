import { useSQLiteContext } from 'expo-sqlite';

interface ITransactionsTUpdate {
  recurrent_id: number;
  value: number;
  month: number;
  year: number;
}

export interface ITransactionsTRow {
  id: number;
  recurrent_id: number;
  value: number;
  month: number;
  year: number;
  updatedAt: string;
}

type ITransactionsTSelect = ITransactionsTRow | null;

export function useTransactionsTable() {
  const database = useSQLiteContext();

  async function set(transaction: ITransactionsTUpdate) {
    await database.runAsync(
      `
      INSERT INTO transactions (recurrent_id, value, month, year, updatedAt)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(recurrent_id, month, year) DO UPDATE SET
        value = excluded.value,
        updatedAt = CURRENT_TIMESTAMP
      `,
      [
        transaction.recurrent_id,
        transaction.value,
        transaction.month,
        transaction.year,
      ]
    );
  }

  async function select(id: number): Promise<ITransactionsTSelect> {
    return (await database.getFirstAsync(
      `SELECT * FROM transactions WHERE id = ?`,
      [id]
    )) as ITransactionsTSelect;
  }

  async function selectByMonth(
    recurrent_id: number,
    month: number,
    year: number
  ): Promise<ITransactionsTSelect> {
    return (await database.getFirstAsync(
      `SELECT * FROM transactions WHERE recurrent_id = ? AND month = ? AND year = ?`,
      [recurrent_id, month, year]
    )) as ITransactionsTSelect;
  }

  async function exclude(id: number) {
    await database.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
  }

  async function list(
    month: number,
    year: number
  ): Promise<ITransactionsTRow[]> {
    return (await database.getAllAsync(
      `SELECT * FROM transactions WHERE month = ? AND year = ?`,
      [month, year]
    )) as ITransactionsTRow[];
  }

  return { set, select, selectByMonth, exclude, list };
}

export const CreateTransactionsTable = `
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recurrent_id INTEGER NOT NULL,
    value INTEGER NOT NULL,
    month INTEGER NOT NULL CHECK(month BETWEEN 1 AND 12),
    year INTEGER NOT NULL,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recurrent_id) REFERENCES recurrents(id) ON DELETE CASCADE,
    UNIQUE(recurrent_id, month, year)
  );
`;
