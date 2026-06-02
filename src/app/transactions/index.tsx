import { AddTransactionForm } from '@/components/drawer-form/transaction/add';
import { EditTransactionForm } from '@/components/drawer-form/transaction/edit';
import { TransactionRowSkeleton } from '@/components/home/transaction-row-skeleton';
import { FloatingBottomNav } from '@/components/layout/floating-bottom-nav';
import { NavHeader } from '@/components/layout/nav-header';
import { TransactionDayGroup } from '@/components/transactions/transaction-day-group';
import { Card } from '@/components/ui/card';
import { useBottomSheetContext } from '@/context/bottomsheet.context';
import { ITransactionsTRow } from '@/database/tables/transactions.table';
import { useFloatingNavRouter } from '@/hooks/use-floating-nav-router';
import { useTransactionsScreen } from '@/hooks/view-models/use-transactions-screen';
import { useFocusEffect } from 'expo-router';
import { PlusIcon } from 'phosphor-react-native';
import { useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

const SKELETON_COUNT = 6;

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

  useFocusEffect(
    useCallback(() => {
      void refreshTransactions();
    }, [refreshTransactions])
  );

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

  const hasGroups = groups.length > 0;
  const showSkeleton = isLoading && !hasGroups;
  const showEmpty = !isLoading && !hasGroups;

  return (
    <View className="flex-1 bg-bg pt-2">
      <NavHeader
        title="Transações"
        description="Listagem  completa das movimentações"
        right={
          <Pressable
            onPress={openAddSheet}
            hitSlop={12}
            className="h-10 w-10 items-center justify-center rounded-full bg-white"
            style={{
              shadowColor: '#FFFFFF',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.16,
              shadowRadius: 14,
              elevation: 2,
            }}
          >
            <PlusIcon size={18} color="#000000" weight="bold" />
          </Pressable>
        }
      />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 4,
          paddingBottom: 110,
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
              Nenhuma movimentação ainda. Escaneie uma nota fiscal ou aguarde
              uma recorrência do dia.
            </Text>
          </Card>
        ) : null}

        {hasGroups
          ? groups.map((g) => (
              <TransactionDayGroup
                key={g.dateKey}
                group={g}
                onEdit={openEditSheet}
                onDelete={removeTransaction}
              />
            ))
          : null}
      </ScrollView>

      <FloatingBottomNav active="tx" onTabPress={onTabPress} />
    </View>
  );
}
