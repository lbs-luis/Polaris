import { AddBankAccountForm } from '@/components/drawer-form/bank-account/add';
import { AddTransactionForm } from '@/components/drawer-form/transaction/add';
import { HomeHeader } from '@/components/home/home-header';
import { MovementCard } from '@/components/home/movement-card';
import { PredictedBalanceCard } from '@/components/home/predicted-balance-card';
import { RecentTransactionsCard } from '@/components/home/recent-transactions-card';
import { SefazNotification } from '@/components/invoice-scanner';
import { FloatingBottomNav } from '@/components/layout/floating-bottom-nav';
import { useBottomSheetContext } from '@/context/bottomsheet.context';
import { IBankAccountTRow } from '@/database/tables/bank-accounts.table';
import { useFloatingNavRouter } from '@/hooks/use-floating-nav-router';
import { useHomeScreen } from '@/hooks/view-models/use-home-screen';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { onTabPress } = useFloatingNavRouter();
  const {
    accounts,
    total,
    monthLabel,
    monthIncome,
    monthOutcome,
    monthNet,
    recentTransactions,
    isLoadingTransactions,
    addAccount,
    updateAccount,
    removeAccount,
    refreshAccounts,
    refreshTransactions,
    refreshHome,
  } = useHomeScreen();
  const { openBottomSheet, closeBottomSheet } = useBottomSheetContext();

  useFocusEffect(
    useCallback(() => {
      void refreshHome();
    }, [refreshHome])
  );

  async function handleAccountSaved() {
    closeBottomSheet();
    await refreshAccounts();
  }

  async function handleTransactionSaved() {
    closeBottomSheet();
    await refreshTransactions();
  }

  function openAddAccountSheet() {
    openBottomSheet(
      <AddBankAccountForm
        onSaved={handleAccountSaved}
        onAdd={addAccount}
        onUpdate={updateAccount}
        onRemove={removeAccount}
      />,
      { title: 'Nova conta' }
    );
  }

  function openEditAccountSheet(account: IBankAccountTRow) {
    openBottomSheet(
      <AddBankAccountForm
        account={account}
        onSaved={handleAccountSaved}
        onAdd={addAccount}
        onUpdate={updateAccount}
        onRemove={removeAccount}
      />,
      { title: 'Editar conta' }
    );
  }

  function openAddTransactionSheet() {
    openBottomSheet(<AddTransactionForm onSaved={handleTransactionSaved} />, {
      title: 'Nova transação',
    });
  }

  return (
    <View className="flex-1 bg-bg pt-2">
      <HomeHeader />
      <SefazNotification />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 110,
        }}
        showsVerticalScrollIndicator={false}
      >
        <PredictedBalanceCard
          total={total}
          accounts={accounts}
          onAddAccount={openAddAccountSheet}
          onEditAccount={openEditAccountSheet}
        />
        <View className="mt-3">
          <MovementCard
            month={monthLabel}
            income={monthIncome}
            outcome={monthOutcome}
            net={monthNet}
          />
        </View>
        {/* <QuickActions
          onScan={() => router.push('/scan')}
          onAdd={openAddAccountSheet}
        /> */}
        <RecentTransactionsCard
          transactions={recentTransactions}
          isLoading={isLoadingTransactions}
          onNew={openAddTransactionSheet}
          onSeeAll={() => router.push('/transactions')}
        />
      </ScrollView>

      <FloatingBottomNav active="home" onTabPress={onTabPress} />
    </View>
  );
}
