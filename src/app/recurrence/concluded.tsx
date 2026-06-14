import { NavHeader } from '@/components/layout/nav-header';
import { Card } from '@/components/ui/card';
import { CatIcon, isCatKind } from '@/components/ui/cat-icon';
import { Label } from '@/components/ui/label';
import { Money } from '@/components/ui/money';
import { Pill } from '@/components/ui/pill';
import { SegItem } from '@/components/ui/seg-item';
import { IRecurrentsTRow } from '@/database/tables/recurrents.table';
import { useConcludedRecurrents } from '@/hooks/view-models/use-concluded-recurrents';
import { rowRadiusClass } from '@/libs/list-radius';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  CaretRightIcon,
  CheckIcon,
} from 'phosphor-react-native';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

type Tab = 'income' | 'outcome';

export default function ConcludedRecurrentsScreen() {
  const router = useRouter();
  const { income, outcome, totalPaidCents, isLoading, refreshConcluded } =
    useConcludedRecurrents();
  const [tab, setTab] = useState<Tab>('outcome');

  useFocusEffect(
    useCallback(() => {
      void refreshConcluded();
    }, [refreshConcluded])
  );

  const entries = tab === 'income' ? income : outcome;

  return (
    <View className="flex-1 bg-bg pt-2">
      <NavHeader
        back
        title="Concluídas"
        description="Parcelamentos quitados e contratos encerrados."
      />

      <View className="px-4 pt-2">
        <View className="flex-row items-baseline justify-between px-1 pb-3">
          <View>
            <Label label="Total já pago" />
            <View className="mt-1">
              <Money
                value={totalPaidCents / 100}
                className="text-2xl text-text"
                bold
              />
            </View>
          </View>
          <Text
            className="text-xs text-text-dim"
            style={{ fontFamily: 'Sora_700Bold' }}
          >
            {income.length + outcome.length}{' '}
            {income.length + outcome.length === 1 ? 'item' : 'itens'}
          </Text>
        </View>

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
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? null : entries.length === 0 ? (
          <Card className="p-5">
            <Text
              className="text-center text-sm text-text-dim"
              style={{ fontFamily: 'Sora_400Regular' }}
            >
              Nenhuma recorrência concluída ainda.
            </Text>
          </Card>
        ) : (
          <Card className="p-0">
            {entries.map((r, i) => (
              <ConcludedRow
                key={r.id}
                row={r}
                index={i}
                total={entries.length}
                onPress={() => router.push(`/recurrence/${r.id}`)}
              />
            ))}
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

interface RowProps {
  row: IRecurrentsTRow;
  index: number;
  total: number;
  onPress: () => void;
}

function ConcludedRow({ row, index, total, onPress }: RowProps) {
  const installments = row.installments_total ?? 1;
  const totalPaid = row.base_value * installments;

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-3 bg-surface px-3 py-3 ${rowRadiusClass(index, total)} ${index === 0 ? '' : 'border-t border-border-subtle'}`}
    >
      {isCatKind(row.category_icon) ? (
        <CatIcon kind={row.category_icon} size={40} />
      ) : (
        <View className="h-10 w-10 items-center justify-center rounded-tile bg-surface-2" />
      )}
      <View className="flex-1">
        <Text
          numberOfLines={1}
          className="text-sm text-text"
          style={{ fontFamily: 'Sora_700Bold' }}
        >
          {row.description || row.category_name}
        </Text>
        <View className="mt-1 flex-row items-center gap-2">
          <Pill tone="income">
            <CheckIcon size={10} color="#3CC85F" weight="bold" />
            Concluída
          </Pill>
          {row.installments_total ? (
            <Text
              className="text-[11px] text-text-dim"
              style={{ fontFamily: 'JetBrainsMono_500Medium' }}
            >
              {row.installments_total}×
            </Text>
          ) : null}
        </View>
      </View>
      <View className="items-end">
        <Money value={totalPaid / 100} className="text-sm text-text" bold />
        <Text
          className="text-[10px] text-text-mute"
          style={{ fontFamily: 'Sora_400Regular' }}
        >
          total
        </Text>
      </View>
      <CaretRightIcon size={14} color="#5E5E66" weight="bold" />
    </Pressable>
  );
}
