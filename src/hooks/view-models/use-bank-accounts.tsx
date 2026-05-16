import {
  IBankAccountTRow,
  useBankAccountsTable,
} from '@/database/tables/bank-accounts.table';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface AccountPayload {
  name: string;
  amount: number;
  color: string;
}

export function useBankAccounts() {
  const { list, set, update, exclude } = useBankAccountsTable();
  const [accounts, setAccounts] = useState<IBankAccountTRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setAccounts(await list());
    setIsLoading(false);
  }, [list]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const total = useMemo(
    () => accounts.reduce((sum, a) => sum + a.amount, 0) / 100,
    [accounts]
  );

  const addAccount = useCallback(
    async (payload: AccountPayload) => {
      await set(payload);
      await refresh();
    },
    [set, refresh]
  );

  const updateAccount = useCallback(
    async (id: number, payload: AccountPayload) => {
      await update(id, payload);
      await refresh();
    },
    [update, refresh]
  );

  const removeAccount = useCallback(
    async (id: number) => {
      await exclude(id);
      await refresh();
    },
    [exclude, refresh]
  );

  return {
    accounts,
    total,
    isLoading,
    refresh,
    addAccount,
    updateAccount,
    removeAccount,
  };
}
