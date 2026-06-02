import {
  IRecurrentsTRow,
  useRecurrentsTable,
} from '@/database/tables/recurrents.table';
import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Loads the recurrents the user has explicitly marked as concluded. Splits
 * them by type for the segmented control on the screen and pre-computes the
 * total amount actually paid (base_value × installments_total when set, or
 * base_value × 1 as a sane fallback when the row is open-ended but marked
 * done).
 */
export function useConcludedRecurrents() {
  const { list } = useRecurrentsTable();

  const [rows, setRows] = useState<IRecurrentsTRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshConcluded = useCallback(async () => {
    setIsLoading(true);
    setRows(await list({ status: 'concluded' }));
    setIsLoading(false);
  }, [list]);

  useEffect(() => {
    refreshConcluded();
  }, [refreshConcluded]);

  const { income, outcome, totalPaidCents } = useMemo(() => {
    const income: IRecurrentsTRow[] = [];
    const outcome: IRecurrentsTRow[] = [];
    let totalPaid = 0;
    for (const r of rows) {
      const installments = r.installments_total ?? 1;
      const paid = r.base_value * installments;
      totalPaid += paid;
      if (r.type === 'income') income.push(r);
      else outcome.push(r);
    }
    return { income, outcome, totalPaidCents: totalPaid };
  }, [rows]);

  return {
    income,
    outcome,
    totalPaidCents,
    isLoading,
    refreshConcluded,
  };
}
