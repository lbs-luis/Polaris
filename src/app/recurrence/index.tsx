import { AddRecurrentForm } from '@/components/drawer-form/recurrent/add';
import { RecurrentDeleteBlockedForm } from '@/components/drawer-form/recurrent/delete-blocked';
import { SameDayPromptForm } from '@/components/drawer-form/recurrent/same-day-prompt';
import { NavHeader } from '@/components/layout/nav-header';
import { DayEntriesList } from '@/components/onboarding/recurrence/day-entries-list';
import { SegItem } from '@/components/ui/seg-item';
import { useBottomSheetContext } from '@/context/bottomsheet.context';
import {
  IRecurrentsTRow,
  useRecurrentsTable,
} from '@/database/tables/recurrents.table';
import { useTransactionsTable } from '@/database/tables/transactions.table';
import { useRecurrentsScreen } from '@/hooks/view-models/use-recurrents-screen';
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  PlusIcon,
} from 'phosphor-react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

type Tab = 'income' | 'outcome';

function AddNewRecurrence({
  type,
  onPress,
}: {
  type: 'income' | 'outcome';
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-card border-[1.5px] border-dashed border-border px-4 py-3.5"
    >
      <View className="h-10 w-10 items-center justify-center rounded-tile bg-surface-2">
        <PlusIcon size={20} color="#ffffff" weight="bold" />
      </View>
      <Text
        className="text-sm text-text"
        style={{ fontFamily: 'Sora_700Bold' }}
      >
        Nova {type === 'income' ? 'entrada' : 'saída'} recorrente
      </Text>
    </Pressable>
  );
}

export default function RecurrentsScreen() {
  const {
    income,
    outcome,
    incomeCategories,
    outcomeCategories,
    refreshRecurrents,
    tryRemove,
  } = useRecurrentsScreen();
  const { setFirstFireMonth, select: selectRecurrent } = useRecurrentsTable();
  const { set: setTransaction } = useTransactionsTable();
  const { openBottomSheet, closeBottomSheet } = useBottomSheetContext();
  const [tab, setTab] = useState<Tab>('outcome');
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      void refreshRecurrents();
    }, [refreshRecurrents])
  );

  const entries = tab === 'income' ? income : outcome;
  const categories = tab === 'income' ? incomeCategories : outcomeCategories;
  const noun = tab === 'income' ? 'entrada' : 'saída';

  /**
   * After save, decide whether to prompt the user about lançar hoje. The
   * prompt only triggers for brand-new rows whose due_day is today or has
   * already passed this month — older days would be confusing if we just
   * silently created a backdated transaction without asking.
   */
  async function handleSaved(info: {
    day: number;
    isNew: boolean;
    recurrentId: number;
    value: number;
    categoryId: number;
  }) {
    const today = new Date();
    const todayDay = today.getDate();
    if (!info.isNew || info.day > todayDay) {
      closeBottomSheet();
      await refreshRecurrents();
      return;
    }

    // Re-fetch so we honour any installments_total the user picked, since
    // we'll need it when announcing the parcel and inserting the first row.
    const saved = await selectRecurrent(info.recurrentId);
    const installments = saved?.installments_total ?? null;
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const nextMonthDate = new Date(year, today.getMonth() + 1, 1);
    const nextMonthKey = `${nextMonthDate.getFullYear()}-${String(
      nextMonthDate.getMonth() + 1
    ).padStart(2, '0')}`;

    closeBottomSheet();

    openBottomSheet(
      <SameDayPromptForm
        day={info.day}
        valueCents={info.value}
        installments={installments}
        isPastDay={info.day < todayDay}
        onLaunchNow={async () => {
          await setTransaction({
            recurrent_id: info.recurrentId,
            value: info.value,
            month,
            year,
            due_day: info.day,
            category_id: info.categoryId,
          });
          // Tell the reconciler "this month is handled" so it doesn't
          // re-insert the same parcela tomorrow.
          await setFirstFireMonth(info.recurrentId, nextMonthKey);
          closeBottomSheet();
          await refreshRecurrents();
        }}
        onWaitNextMonth={async () => {
          await setFirstFireMonth(info.recurrentId, nextMonthKey);
          closeBottomSheet();
          await refreshRecurrents();
        }}
      />,
      { title: 'Cobrar hoje?' }
    );
  }

  function openDrawer(recurrent?: IRecurrentsTRow) {
    openBottomSheet(
      <AddRecurrentForm
        type={tab}
        categories={categories}
        registries={entries}
        recurrent={recurrent}
        onSaved={handleSaved}
      />,
      { title: recurrent ? `Editar ${noun}` : `Nova ${noun}` }
    );
  }

  async function handleDelete(id: number) {
    const { removed, count } = await tryRemove(id);
    if (removed) return;
    openBottomSheet(
      <RecurrentDeleteBlockedForm count={count} onClose={closeBottomSheet} />,
      { title: 'Não é possível excluir' }
    );
  }

  return (
    <View className="flex-1 bg-bg pt-2">
      <NavHeader
        back
        title="Recorrências"
        description="Entradas e saídas que se repetem todo mês."
      />

      <View className="px-4 pt-2">
        <View className="flex-row gap-2">
          <SegItem
            icon={ArrowDownLeftIcon}
            label="Entradas"
            tone="income"
            active={tab === 'income'}
            onPress={() => setTab('income')}
          />
          <SegItem
            icon={ArrowUpRightIcon}
            label="Saídas"
            tone="outcome"
            active={tab === 'outcome'}
            onPress={() => setTab('outcome')}
          />
        </View>
      </View>

      <ScrollView
        className="my-3.5  flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 6,
          paddingBottom: 6,
        }}
        showsVerticalScrollIndicator={false}
      >
        <DayEntriesList
          entries={entries}
          type={tab}
          onEdit={openDrawer}
          onDelete={handleDelete}
          onRowPress={(item) => router.push(`/recurrence/${item.id}`)}
        />
      </ScrollView>
      <View className=" px-4 pb-4">
        <AddNewRecurrence onPress={() => openDrawer()} type={tab} />
      </View>
    </View>
  );
}
