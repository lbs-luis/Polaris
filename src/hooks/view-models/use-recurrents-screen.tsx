import {
  ICategoriesTRow,
  useCategoriesTable,
} from '@/database/tables/categories.table';
import {
  IRecurrentsTRow,
  useRecurrentsTable,
} from '@/database/tables/recurrents.table';
import { useTransactionsTable } from '@/database/tables/transactions.table';
import { useCallback, useEffect, useState } from 'react';

interface RecurrentsScreenState {
  income: IRecurrentsTRow[];
  outcome: IRecurrentsTRow[];
  incomeCategories: ICategoriesTRow[];
  outcomeCategories: ICategoriesTRow[];
  isLoading: boolean;
}

const INITIAL: RecurrentsScreenState = {
  income: [],
  outcome: [],
  incomeCategories: [],
  outcomeCategories: [],
  isLoading: true,
};

/**
 * View-model for the `/recurrents` route. Surfaces both income + outcome
 * recurrents alongside the matching default categories so the add/edit
 * sheet can be filled without each caller re-fetching.
 *
 * `tryRemove` enforces the business rule that recurrents linked to any
 * existing transaction cannot be deleted: it returns the transaction count
 * so the caller can decide between deleting and showing the blocked modal.
 */
export function useRecurrentsScreen() {
  const { list: listRecurrents, exclude } = useRecurrentsTable();
  const { list: listCategories } = useCategoriesTable();
  const { countByRecurrent } = useTransactionsTable();

  const [state, setState] = useState<RecurrentsScreenState>(INITIAL);

  const refreshRecurrents = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true }));
    const [income, outcome, incomeCategories, outcomeCategories] =
      await Promise.all([
        listRecurrents({ type: 'income' }),
        listRecurrents({ type: 'outcome' }),
        listCategories('income'),
        listCategories('outcome'),
      ]);
    setState({
      income,
      outcome,
      incomeCategories,
      outcomeCategories,
      isLoading: false,
    });
  }, [listRecurrents, listCategories]);

  useEffect(() => {
    refreshRecurrents();
  }, [refreshRecurrents]);

  const tryRemove = useCallback(
    async (id: number): Promise<{ removed: boolean; count: number }> => {
      const count = await countByRecurrent(id);
      if (count > 0) return { removed: false, count };
      await exclude(id);
      await refreshRecurrents();
      return { removed: true, count: 0 };
    },
    [countByRecurrent, exclude, refreshRecurrents]
  );

  return {
    ...state,
    refreshRecurrents,
    tryRemove,
  };
}
