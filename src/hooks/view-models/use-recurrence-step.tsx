import {
  ICategoriesTRow,
  useCategoriesTable,
} from '@/database/tables/categories.table';
import {
  IRecurrentsTRow,
  useRecurrentsTable,
} from '@/database/tables/recurrents.table';
import { useCallback, useEffect, useState } from 'react';

export function useRecurrenceStep(type: 'income' | 'outcome') {
  const { list: listRecurrents } = useRecurrentsTable();
  const { list: listCategories } = useCategoriesTable();

  const [registries, setRegistries] = useState<IRecurrentsTRow[]>([]);
  const [categories, setCategories] = useState<ICategoriesTRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const [updatedRegistries, updatedCategories] = await Promise.all([
      listRecurrents(type),
      listCategories(type),
    ]);
    setRegistries(updatedRegistries);
    setCategories(updatedCategories);
    setIsLoading(false);
  }, [listRecurrents, listCategories, type]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { registries, categories, isLoading, refresh: loadData };
}
