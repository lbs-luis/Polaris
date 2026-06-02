import { useInvoiceProcessorContext } from '@/context/invoice-processor.context';
import {
  ITransactionsTRow,
  useTransactionsTable,
} from '@/database/tables/transactions.table';
import { useBankAccounts } from '@/hooks/view-models/use-bank-accounts';
import { MONTH_NAMES } from '@/libs/dates';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const RECENT_LIMIT = 10;

export function useHomeScreen() {
  const bankAccounts = useBankAccounts();
  const { list } = useTransactionsTable();
  const { state: processorState } = useInvoiceProcessorContext();

  const [transactions, setTransactions] = useState<ITransactionsTRow[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);

  const refreshTransactions = useCallback(async () => {
    setIsLoadingTransactions(true);
    setTransactions(await list());
    setIsLoadingTransactions(false);
  }, [list]);

  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);

  // Re-fetch when the SEFAZ processor finishes a batch so freshly-imported
  // transactions show up in the recent list automatically.
  const lastProcessorStatus = useRef(processorState.status);
  useEffect(() => {
    if (
      lastProcessorStatus.current !== 'done' &&
      processorState.status === 'done'
    ) {
      refreshTransactions();
    }
    lastProcessorStatus.current = processorState.status;
  }, [processorState.status, refreshTransactions]);

  const now = useMemo(() => new Date(), []);
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const monthLabel = MONTH_NAMES[now.getMonth()];

  const { monthIncome, monthOutcome } = useMemo(() => {
    let income = 0;
    let outcome = 0;
    for (const t of transactions) {
      if (t.month !== currentMonth || t.year !== currentYear) continue;
      if (t.category_type === 'income') income += t.value;
      else if (t.category_type === 'outcome') outcome += t.value;
      else if (t.value >= 0) income += t.value;
      else outcome += Math.abs(t.value);
    }
    return { monthIncome: income / 100, monthOutcome: outcome / 100 };
  }, [transactions, currentMonth, currentYear]);

  const monthNet = monthIncome - monthOutcome;

  const recentTransactions = useMemo(
    () => transactions.slice(0, RECENT_LIMIT),
    [transactions]
  );

  const { refreshAccounts } = bankAccounts;
  const refreshHome = useCallback(async () => {
    await Promise.all([refreshAccounts(), refreshTransactions()]);
  }, [refreshAccounts, refreshTransactions]);

  return {
    accounts: bankAccounts.accounts,
    total: bankAccounts.total,
    addAccount: bankAccounts.addAccount,
    updateAccount: bankAccounts.updateAccount,
    removeAccount: bankAccounts.removeAccount,
    monthLabel,
    monthIncome,
    monthOutcome,
    monthNet,
    recentTransactions,
    isLoadingAccounts: bankAccounts.isLoading,
    isLoadingTransactions,
    refreshAccounts,
    refreshTransactions,
    refreshHome,
  };
}
