import {
  IInvoiceItem,
  IInvoicesTRow,
  useInvoicesTable,
} from '@/database/tables/invoices.table';
import {
  IRecurrentsTRow,
  useRecurrentsTable,
} from '@/database/tables/recurrents.table';
import {
  ITransactionsTRow,
  useTransactionsTable,
} from '@/database/tables/transactions.table';
import { useCallback, useEffect, useState } from 'react';

interface TransactionDetailState {
  transaction: ITransactionsTRow | null;
  invoice: IInvoicesTRow | null;
  recurrent: IRecurrentsTRow | null;
  items: IInvoiceItem[];
  isLoading: boolean;
}

const INITIAL: TransactionDetailState = {
  transaction: null,
  invoice: null,
  recurrent: null,
  items: [],
  isLoading: true,
};

/**
 * Loads a single transaction plus its related invoice (when invoice-linked)
 * or parent recurrency (when recurrent-linked). The detail page renders
 * different sections based on which of these is present, so the view-model
 * exposes both via discriminated optional fields.
 */
export function useTransactionDetail(id: number) {
  const { select: selectTransaction, exclude } = useTransactionsTable();
  const { select: selectInvoice } = useInvoicesTable();
  const { select: selectRecurrent } = useRecurrentsTable();

  const [state, setState] = useState<TransactionDetailState>(INITIAL);

  const load = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true }));
    const tx = await selectTransaction(id);
    if (!tx) {
      setState({ ...INITIAL, isLoading: false });
      return;
    }
    const invoice = tx.invoice_id ? await selectInvoice(tx.invoice_id) : null;
    const recurrent = tx.recurrent_id
      ? await selectRecurrent(tx.recurrent_id)
      : null;

    let items: IInvoiceItem[] = [];
    if (invoice?.items) {
      try {
        const parsed = JSON.parse(invoice.items);
        if (Array.isArray(parsed)) items = parsed as IInvoiceItem[];
      } catch {
        items = [];
      }
    }

    setState({
      transaction: tx,
      invoice,
      recurrent,
      items,
      isLoading: false,
    });
  }, [id, selectTransaction, selectInvoice, selectRecurrent]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = useCallback(async () => {
    if (!state.transaction) return;
    await exclude(state.transaction.id);
  }, [exclude, state.transaction]);

  return {
    ...state,
    refresh: load,
    remove,
  };
}
