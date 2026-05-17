import { NavHeader } from '@/components/layout/nav-header';
import { DayEntriesList } from '@/components/onboarding/recurrence/day-entries-list';
import { AddRecurrentDrawer } from '@/components/recurrence/add-recurrent-drawer';
import { RecurrentDeleteBlocked } from '@/components/recurrence/recurrent-delete-blocked';

import { SegItem } from '@/components/ui/seg-item';
import { useBottomSheetContext } from '@/context/bottomsheet.context';
import { IRecurrentsTRow } from '@/database/tables/recurrents.table';
import { useRecurrentsScreen } from '@/hooks/view-models/use-recurrents-screen';
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  PlusIcon,
} from 'phosphor-react-native';
import { useState } from 'react';
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
    refresh,
    tryRemove,
  } = useRecurrentsScreen();
  const { openBottomSheet, closeBottomSheet } = useBottomSheetContext();
  const [tab, setTab] = useState<Tab>('outcome');

  const entries = tab === 'income' ? income : outcome;
  const categories = tab === 'income' ? incomeCategories : outcomeCategories;
  const noun = tab === 'income' ? 'entrada' : 'saída';

  function handleSaved() {
    closeBottomSheet();
    refresh();
  }

  function openDrawer(recurrent?: IRecurrentsTRow) {
    openBottomSheet(
      <AddRecurrentDrawer
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
      <RecurrentDeleteBlocked count={count} onClose={closeBottomSheet} />,
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
        />
      </ScrollView>
      <View className=" px-4 pb-4">
        <AddNewRecurrence onPress={() => openDrawer()} type={tab} />
      </View>
    </View>
  );
}
