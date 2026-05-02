import { useSQLiteContext } from 'expo-sqlite';

interface ITransactionsTUpdate {
  recurrent_id?: number | null;
  value: number;
  month: number;
  year: number;
  due_day?: number;
  description?: string;
  category_id?: number;
  invoice_id?: string | null;
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
  invoice_id: string | null;
  updatedAt: string;
}

type ITransactionsTSelect = ITransactionsTRow | null;

export function useTransactionsTable() {
  const database = useSQLiteContext();

  async function set(transaction: ITransactionsTUpdate) {
    await database.runAsync(
      `INSERT INTO transactions (recurrent_id, value, month, year, due_day, description, category_id, invoice_id, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        transaction.recurrent_id ?? null,
        transaction.value,
        transaction.month,
        transaction.year,
        transaction.due_day ?? null,
        transaction.description ?? null,
        transaction.category_id ?? null,
        transaction.invoice_id ?? null,
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

  async function list(): Promise<ITransactionsTRow[]> {
    return (await database.getAllAsync(
      `SELECT * FROM transactions ORDER BY year DESC, month DESC, due_day DESC`
    )) as ITransactionsTRow[];
  }

  return { set, select, selectByMonth, exclude, list };
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
    invoice_id TEXT REFERENCES invoices(chave_acesso) ON DELETE SET NULL,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recurrent_id) REFERENCES recurrents(id) ON DELETE CASCADE
  );
`;