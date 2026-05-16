import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';

interface IBankAccountTUpdate {
  name: string;
  amount: number;
  color: string;
}

export interface IBankAccountTRow {
  id: number;
  name: string;
  amount: number;
  color: string;
  updatedAt: string;
}

export function useBankAccountsTable() {
  const database = useSQLiteContext();

  const set = useCallback(
    async (account: IBankAccountTUpdate) => {
      await database.runAsync(
        `INSERT INTO bank_accounts (name, amount, color, updatedAt)
         VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
        [account.name, account.amount, account.color]
      );
    },
    [database]
  );

  const update = useCallback(
    async (id: number, account: IBankAccountTUpdate) => {
      await database.runAsync(
        `UPDATE bank_accounts SET
          name = ?, amount = ?, color = ?, updatedAt = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [account.name, account.amount, account.color, id]
      );
    },
    [database]
  );

  const exclude = useCallback(
    async (id: number) => {
      await database.runAsync('DELETE FROM bank_accounts WHERE id = ?', [id]);
    },
    [database]
  );

  const select = useCallback(
    async (id: number): Promise<IBankAccountTRow | null> => {
      return (await database.getFirstAsync(
        'SELECT * FROM bank_accounts WHERE id = ?',
        [id]
      )) as IBankAccountTRow | null;
    },
    [database]
  );

  const list = useCallback(async (): Promise<IBankAccountTRow[]> => {
    return (await database.getAllAsync(
      'SELECT * FROM bank_accounts ORDER BY id ASC'
    )) as IBankAccountTRow[];
  }, [database]);

  return { set, update, exclude, select, list };
}

export const CreateBankAccountsTable = `
  CREATE TABLE IF NOT EXISTS bank_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    amount INTEGER NOT NULL DEFAULT 0,
    color TEXT NOT NULL,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`;
