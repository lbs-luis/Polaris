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

  const refreshAccounts = useCallback(async () => {
    setIsLoading(true);
    setAccounts(await list());
    setIsLoading(false);
  }, [list]);

  useEffect(() => {
    refreshAccounts();
  }, [refreshAccounts]);

  const total = useMemo(
    () => accounts.reduce((sum, a) => sum + a.amount, 0) / 100,
    [accounts]
  );

  const addAccount = useCallback(
    async (payload: AccountPayload) => {
      await set(payload);
      await refreshAccounts();
    },
    [set, refreshAccounts]
  );

  const updateAccount = useCallback(
    async (id: number, payload: AccountPayload) => {
      await update(id, payload);
      await refreshAccounts();
    },
    [update, refreshAccounts]
  );

  const removeAccount = useCallback(
    async (id: number) => {
      await exclude(id);
      await refreshAccounts();
    },
    [exclude, refreshAccounts]
  );

  return {
    accounts,
    total,
    isLoading,
    refreshAccounts,
    addAccount,
    updateAccount,
    removeAccount,
  };
}
