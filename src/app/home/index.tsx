import { AddBankAccountForm } from '@/components/home/add-bank-account-form';
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
import { ScrollView, View } from 'react-native';

export default function HomeScreen() {
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
    refresh,
  } = useHomeScreen();
  const { openBottomSheet, closeBottomSheet } = useBottomSheetContext();

  async function handleSaved() {
    closeBottomSheet();
    await refresh();
  }

  function openAddAccountSheet() {
    openBottomSheet(
      <AddBankAccountForm
        onSaved={handleSaved}
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
        onSaved={handleSaved}
        onAdd={addAccount}
        onUpdate={updateAccount}
        onRemove={removeAccount}
      />,
      { title: 'Editar conta' }
    );
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
        />
      </ScrollView>

      <FloatingBottomNav active="home" onTabPress={onTabPress} />
    </View>
  );
}
