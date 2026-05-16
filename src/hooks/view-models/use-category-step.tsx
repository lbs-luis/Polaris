import {
  ICategoriesTRow,
  useCategoriesTable,
} from '@/database/tables/categories.table';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function useCategoryStep() {
  const { list, exclude } = useCategoriesTable();
  const [categories, setCategories] = useState<ICategoriesTRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setCategories(await list());
    setIsLoading(false);
  }, [list]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const incomes = useMemo(
    () => categories.filter((c) => c.type === 'income'),
    [categories]
  );
  const outcomes = useMemo(
    () => categories.filter((c) => c.type === 'outcome'),
    [categories]
  );

  const handleDelete = useCallback(
    async (name: string) => {
      await exclude(name);
      await refresh();
    },
    [exclude, refresh]
  );

  return { incomes, outcomes, isLoading, refresh, handleDelete };
}
