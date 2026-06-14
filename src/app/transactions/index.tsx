import { AddTransactionForm } from '@/components/drawer-form/transaction/add';
import { EditTransactionForm } from '@/components/drawer-form/transaction/edit';
import { TransactionRowSkeleton } from '@/components/home/transaction-row-skeleton';
import { BottomNav } from '@/components/layout/bottom-nav';
import { NavHeader } from '@/components/layout/nav-header';
import { TransactionDayGroup } from '@/components/transactions/transaction-day-group';
import { Card } from '@/components/ui/card';
import { FilterChips } from '@/components/ui/filter-chips';
import { Fab } from '@/components/ui/fab';
import { useBottomSheetContext } from '@/context/bottomsheet.context';
import { ITransactionsTRow } from '@/database/tables/transactions.table';
import { useFloatingNavRouter } from '@/hooks/use-floating-nav-router';
import {
  TransactionDayGroup as DayGroup,
  useTransactionsScreen,
} from '@/hooks/view-models/use-transactions-screen';
import { useFocusEffect } from 'expo-router';
import { ReceiptIcon } from 'phosphor-react-native';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

const SKELETON_COUNT = 6;

type Filter = 'all' | 'in' | 'out' | 'inv';

function rowMatches(t: ITransactionsTRow, filter: Filter): boolean {
  switch (filter) {
    case 'in':
      return (
        t.category_type === 'income' ||
        (t.category_type == null && t.value >= 0)
      );
    case 'out':
      return (
        t.category_type === 'outcome' ||
        (t.category_type == null && t.value < 0)
      );
    case 'inv':
      return t.invoice_id != null;
    default:
      return true;
  }
}

export default function TransactionsScreen() {
  const {
    groups,
    isLoading,
    refreshTransactions,
    removeTransaction,
    updateTransaction,
  } = useTransactionsScreen();
  const { openBottomSheet, closeBottomSheet } = useBottomSheetContext();
  const { onTabPress } = useFloatingNavRouter();
  const [filter, setFilter] = useState<Filter>('all');

  useFocusEffect(
    useCallback(() => {
      void refreshTransactions();
    }, [refreshTransactions])
  );

  const visibleGroups = useMemo<DayGroup[]>(() => {
    if (filter === 'all') return groups;
    return groups
      .map((g) => ({ ...g, rows: g.rows.filter((t) => rowMatches(t, filter)) }))
      .filter((g) => g.rows.length > 0);
  }, [groups, filter]);

  function openEditSheet(t: ITransactionsTRow) {
    openBottomSheet(
      <EditTransactionForm
        transaction={t}
        onUpdate={updateTransaction}
        onSaved={async () => {
          closeBottomSheet();
          await refreshTransactions();
        }}
      />,
      { title: 'Editar lançamento' }
    );
  }

  function openAddSheet() {
    openBottomSheet(
      <AddTransactionForm
        onSaved={async () => {
          closeBottomSheet();
          await refreshTransactions();
        }}
      />,
      { title: 'Nova transação' }
    );
  }

  const hasGroups = visibleGroups.length > 0;
  const showSkeleton = isLoading && groups.length === 0;
  const showEmpty = !isLoading && !hasGroups;

  return (
    <View className="flex-1 bg-bg">
      <NavHeader title="Transações" />

      <View className="py-2">
        <FilterChips
          value={filter}
          onChange={setFilter}
          chips={[
            { id: 'all', label: 'Todas' },
            { id: 'in', label: 'Entradas' },
            { id: 'out', label: 'Saídas' },
            { id: 'inv', label: 'Nota fiscal', icon: ReceiptIcon },
          ]}
        />
      </View>

      <ScrollView
        className="mt-4 flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 96,
        }}
        showsVerticalScrollIndicator={false}
      >
        {showSkeleton ? (
          <Card className="p-0">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <TransactionRowSkeleton key={`sk-${i}`} isFirst={i === 0} />
            ))}
          </Card>
        ) : null}

        {showEmpty ? (
          <Card className="mt-2 p-6">
            <Text
              className="text-center text-sm text-text-dim"
              style={{ fontFamily: 'Sora_400Regular' }}
            >
              {filter === 'all'
                ? 'Nenhuma movimentação ainda. Escaneie uma nota fiscal ou aguarde uma recorrência do dia.'
                : 'Nenhuma transação neste filtro.'}
            </Text>
          </Card>
        ) : null}

        {hasGroups
          ? visibleGroups.map((g) => (
              <TransactionDayGroup
                key={g.dateKey}
                group={g}
                onEdit={openEditSheet}
                onDelete={removeTransaction}
              />
            ))
          : null}
      </ScrollView>

      <Fab onPress={openAddSheet} />
      <BottomNav active="tx" onTabPress={onTabPress} />
    </View>
  );
}
