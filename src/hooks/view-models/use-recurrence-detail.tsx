import {
  IRecurrentsTRow,
  useRecurrentsTable,
} from '@/database/tables/recurrents.table';
import { useTransactionsTable } from '@/database/tables/transactions.table';
import { useCallback, useEffect, useState } from 'react';

interface RecurrenceDetailState {
  recurrent: IRecurrentsTRow | null;
  /** Number of transactions actually linked to this recurrent. Drives the
   *  installments progress bar — for installment-bounded rows the user
   *  knows how many parcelas have been paid; for open-ended rows it's
   *  just a "lançamentos vinculados" count. */
  paidCount: number;
  isLoading: boolean;
}

const INITIAL: RecurrenceDetailState = {
  recurrent: null,
  paidCount: 0,
  isLoading: true,
};

/**
 * Detail-page view-model. Loads the recurrent row + its linked-transaction
 * count, and exposes mutation helpers (`conclude`, `reopen`, `remove`) so
 * the detail page stays a thin renderer.
 */
export function useRecurrenceDetail(id: number) {
  const {
    select,
    conclude: concludeRow,
    reopen: reopenRow,
    exclude,
  } = useRecurrentsTable();
  const { countByRecurrent } = useTransactionsTable();

  const [state, setState] = useState<RecurrenceDetailState>(INITIAL);

  const refreshRecurrence = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true }));
    const row = await select(id);
    if (!row) {
      setState({ ...INITIAL, isLoading: false });
      return;
    }
    const paidCount = await countByRecurrent(id);
    setState({ recurrent: row, paidCount, isLoading: false });
  }, [id, select, countByRecurrent]);

  useEffect(() => {
    refreshRecurrence();
  }, [refreshRecurrence]);

  const conclude = useCallback(async () => {
    await concludeRow(id);
    await refreshRecurrence();
  }, [concludeRow, id, refreshRecurrence]);

  const reopen = useCallback(async () => {
    await reopenRow(id);
    await refreshRecurrence();
  }, [reopenRow, id, refreshRecurrence]);

  const remove = useCallback(async () => {
    await exclude(id);
  }, [exclude, id]);

  return { ...state, refreshRecurrence, conclude, reopen, remove };
}
