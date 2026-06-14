import { AddTransactionForm } from '@/components/drawer-form/transaction/add';
import { HomeGreeting } from '@/components/home/home-greeting';
import { TransactionRowSkeleton } from '@/components/home/transaction-row-skeleton';
import { SefazNotification } from '@/components/invoice-scanner';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Fab } from '@/components/ui/fab';
import { ListGroup } from '@/components/ui/list';
import { Money } from '@/components/ui/money';
import { TransactionRow } from '@/components/ui/transaction-row';
import { useBottomSheetContext } from '@/context/bottomsheet.context';
import { useFloatingNavRouter } from '@/hooks/use-floating-nav-router';
import { useHomeScreen } from '@/hooks/view-models/use-home-screen';
import { useFocusEffect, useRouter } from 'expo-router';
import { ScanIcon } from 'phosphor-react-native';
import { useCallback } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const SKELETON_COUNT = 5;

export default function HomeScreen() {
  const router = useRouter();
  const { onTabPress } = useFloatingNavRouter();
  const {
    total,
    recentTransactions,
    isLoadingTransactions,
    refreshTransactions,
    refreshHome,
  } = useHomeScreen();
  const { openBottomSheet, closeBottomSheet } = useBottomSheetContext();

  useFocusEffect(
    useCallback(() => {
      void refreshHome();
    }, [refreshHome])
  );

  function openAddTransactionSheet() {
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

  const showSkeleton = isLoadingTransactions && recentTransactions.length === 0;
  const showEmpty = !isLoadingTransactions && recentTransactions.length === 0;

  return (
    <View className="flex-1 bg-bg">
      <HomeGreeting />

      <ScrollView
        className="mt-4 flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 96,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance — the calm focus of the screen */}
        <View className="px-2 pb-6 pt-1">
          <Text
            className="text-xs uppercase text-text-mute"
            style={{ fontFamily: 'Sora_700Bold', letterSpacing: 0.6 }}
          >
            Saldo total
          </Text>
          <Money
            value={total}
            bold
            className="text-[44px] text-text"
            style={{ letterSpacing: -1.4, marginTop: 8 }}
          />
        </View>

        {/* SEFAZ scan progress — collapses to nothing when idle */}
        <View className="mb-3.5">
          <SefazNotification />
        </View>

        {/* Recent movements */}
        <View className="flex-row items-baseline justify-between px-2.5 pb-2.5">
          <Text
            className="text-xs uppercase text-text-mute"
            style={{ fontFamily: 'Sora_700Bold', letterSpacing: 0.6 }}
          >
            Movimentações
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/transactions')}
            hitSlop={8}
          >
            <Text
              className="text-[13px] text-text-dim"
              style={{ fontFamily: 'Sora_600SemiBold' }}
            >
              Ver tudo
            </Text>
          </TouchableOpacity>
        </View>

        <ListGroup>
          {showSkeleton
            ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                <TransactionRowSkeleton
                  key={`skeleton-${index}`}
                  isFirst={index === 0}
                />
              ))
            : null}

          {showEmpty ? (
            <View className="px-4 py-7">
              <Text
                className="text-center text-sm text-text-dim"
                style={{ fontFamily: 'Sora_400Regular' }}
              >
                Nenhuma movimentação ainda. Toque em + para lançar uma
                transação.
              </Text>
            </View>
          ) : null}

          {!showSkeleton && !showEmpty
            ? recentTransactions.map((transaction, index) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  isFirst={index === 0}
                />
              ))
            : null}
        </ListGroup>
      </ScrollView>

      <Fab
        onPress={openAddTransactionSheet}
        secondaryIcon={ScanIcon}
        onSecondaryPress={() => router.push('/scan')}
      />
      <BottomNav active="home" onTabPress={onTabPress} />
    </View>
  );
}
