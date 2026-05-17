import { useInvoiceProcessorContext } from '@/context/invoice-processor.context';
import {
  ITransactionsTRow,
  useTransactionsTable,
} from '@/database/tables/transactions.table';
import { formatRelativeDate } from '@/libs/dates';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface TransactionDayGroup {
  /** Sortable key (YYYY-MM-DD). */
  dateKey: string;
  day: number;
  month: number;
  year: number;
  /** "Hoje" / "Ontem" / "Sex, 12 Mai" */
  label: string;
  /** Sum of signed values (cents) — positive for incomes, negative for outcomes. */
  netCents: number;
  rows: ITransactionsTRow[];
}

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

/**
 * Derives a YYYY-MM-DD date key from a transaction. Invoice-imported rows use
 * the precise `issued_at` timestamp; recurrent / manual rows fall back to the
 * year + month + due_day triple. Rows without a due_day land on day 1 (a
 * conservative default that keeps them grouped near the start of the month).
 */
function dateKeyFor(t: ITransactionsTRow): {
  dateKey: string;
  day: number;
  month: number;
  year: number;
} {
  if (t.issued_at && /^\d{4}-\d{2}-\d{2}/.test(t.issued_at)) {
    const [y, m, d] = t.issued_at.slice(0, 10).split('-').map(Number);
    return { dateKey: t.issued_at.slice(0, 10), year: y, month: m, day: d };
  }
  const day = t.due_day ?? 1;
  return {
    dateKey: `${t.year}-${pad(t.month)}-${pad(day)}`,
    year: t.year,
    month: t.month,
    day,
  };
}

function signedCents(t: ITransactionsTRow): number {
  if (t.category_type === 'outcome') return -Math.abs(t.value);
  if (t.category_type === 'income') return Math.abs(t.value);
  return t.value;
}

export function useTransactionsScreen() {
  const { list, exclude, update } = useTransactionsTable();
  const { state: processorState } = useInvoiceProcessorContext();

  const [transactions, setTransactions] = useState<ITransactionsTRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    setTransactions(await list());
    setIsLoading(false);
  }, [list]);

  useEffect(() => {
    load();
  }, [load]);

  // Same edge-trigger pattern as the home screen — refresh whenever the
  // SEFAZ processor transitions into 'done' so new invoices show up.
  const lastProcessorStatus = useRef(processorState.status);
  useEffect(() => {
    if (
      lastProcessorStatus.current !== 'done' &&
      processorState.status === 'done'
    ) {
      load();
    }
    lastProcessorStatus.current = processorState.status;
  }, [processorState.status, load]);

  const groups = useMemo<TransactionDayGroup[]>(() => {
    const buckets = new Map<string, TransactionDayGroup>();

    for (const t of transactions) {
      const meta = dateKeyFor(t);
      let bucket = buckets.get(meta.dateKey);
      if (!bucket) {
        bucket = {
          dateKey: meta.dateKey,
          day: meta.day,
          month: meta.month,
          year: meta.year,
          label: formatRelativeDate(meta.day, meta.month, meta.year),
          netCents: 0,
          rows: [],
        };
        buckets.set(meta.dateKey, bucket);
      }
      bucket.rows.push(t);
      bucket.netCents += signedCents(t);
    }

    // Sort rows within each bucket: invoice rows by issued_at desc,
    // others by id desc as a stable tiebreaker.
    for (const bucket of buckets.values()) {
      bucket.rows.sort((a, b) => {
        const aIso = a.issued_at ?? '';
        const bIso = b.issued_at ?? '';
        if (aIso && bIso) return bIso.localeCompare(aIso);
        if (aIso) return -1;
        if (bIso) return 1;
        return b.id - a.id;
      });
    }

    return [...buckets.values()].sort((a, b) =>
      b.dateKey.localeCompare(a.dateKey)
    );
  }, [transactions]);

  const removeTransaction = useCallback(
    async (id: number) => {
      await exclude(id);
      await load();
    },
    [exclude, load]
  );

  const updateTransaction = useCallback(
    async (id: number, partial: Parameters<typeof update>[1]) => {
      await update(id, partial);
      await load();
    },
    [update, load]
  );

  return {
    groups,
    isLoading,
    refresh: load,
    removeTransaction,
    updateTransaction,
  };
}
