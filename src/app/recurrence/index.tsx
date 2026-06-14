import { AddRecurrentForm } from '@/components/drawer-form/recurrent/add';
import { RecurrentDeleteBlockedForm } from '@/components/drawer-form/recurrent/delete-blocked';
import { SameDayPromptForm } from '@/components/drawer-form/recurrent/same-day-prompt';
import { BottomNav } from '@/components/layout/bottom-nav';
import { NavHeader } from '@/components/layout/nav-header';
import { DayEntriesList } from '@/components/onboarding/recurrence/day-entries-list';
import { Fab } from '@/components/ui/fab';
import { IconTile } from '@/components/ui/icon-tile';
import { ListGroup, ListRow } from '@/components/ui/list';
import { Money } from '@/components/ui/money';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { useBottomSheetContext } from '@/context/bottomsheet.context';
import {
  IRecurrentsTRow,
  useRecurrentsTable,
} from '@/database/tables/recurrents.table';
import { useTransactionsTable } from '@/database/tables/transactions.table';
import { useFloatingNavRouter } from '@/hooks/use-floating-nav-router';
import { useRecurrentsScreen } from '@/hooks/view-models/use-recurrents-screen';
import { theme } from '@/libs/theme';
import { useFocusEffect, useRouter } from 'expo-router';
import { CheckCircleIcon } from 'phosphor-react-native';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

type Tab = 'income' | 'outcome';

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
  const { onTabPress } = useFloatingNavRouter();
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

  const total = useMemo(
    () => entries.reduce((s, e) => s + e.base_value, 0) / 100,
    [entries]
  );

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
    <View className="flex-1 bg-bg">
      <NavHeader title="Recorrências" />

      <View className="px-6 py-2">
        <SegmentedControl<Tab>
          value={tab}
          onChange={setTab}
          options={[
            { id: 'income', label: 'Entradas' },
            { id: 'outcome', label: 'Saídas' },
          ]}
        />
      </View>

      <View className="mt-2 px-7 py-2">
        <Text
          className="text-xs uppercase text-text-mute"
          style={{ fontFamily: 'Sora_700Bold', letterSpacing: 0.6 }}
        >
          {tab === 'income' ? 'Recebimentos mensais' : 'Compromissos mensais'}
        </Text>
        <Money
          value={total}
          bold
          className={`text-[28px] ${tab === 'income' ? 'text-income' : 'text-text'}`}
          style={{ letterSpacing: -0.6, marginTop: 8 }}
        />
      </View>

      <ScrollView
        className="mt-2 flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 96,
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

        {/* History — natural end of the list, within thumb reach */}
        <View className="mt-4">
          <ListGroup>
            <ListRow
              left={<IconTile icon={CheckCircleIcon} color={theme.income} />}
              title="Concluídas"
              sub="Parcelamentos quitados e contratos encerrados"
              chevron
              onPress={() => router.push('/recurrence/concluded')}
            />
          </ListGroup>
        </View>
      </ScrollView>

      <Fab onPress={() => openDrawer()} />
      <BottomNav active="rec" onTabPress={onTabPress} />
    </View>
  );
}
