import { NavHeader } from '@/components/layout/nav-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CatIcon, isCatKind } from '@/components/ui/cat-icon';
import { Money } from '@/components/ui/money';
import { Pill } from '@/components/ui/pill';
import { IRecurrentsTRow } from '@/database/tables/recurrents.table';
import { useRecurrenceDetail } from '@/hooks/view-models/use-recurrence-detail';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { ArrowsClockwiseIcon, CheckIcon } from 'phosphor-react-native';
import { ReactNode, useCallback } from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function RecurrenceDetailScreen() {
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const id = Number(idParam);

  const {
    recurrent,
    paidCount,
    isLoading,
    conclude,
    reopen,
    refreshRecurrence,
  } = useRecurrenceDetail(Number.isFinite(id) ? id : -1);

  useFocusEffect(
    useCallback(() => {
      void refreshRecurrence();
    }, [refreshRecurrence])
  );

  return (
    <View className="flex-1 bg-bg pt-2">
      <NavHeader back title="Detalhes da recorrência" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 4,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <Text
            className="mt-12 text-center text-sm text-text-dim"
            style={{ fontFamily: 'Sora_400Regular' }}
          >
            Carregando...
          </Text>
        ) : !recurrent ? (
          <Text
            className="mt-12 text-center text-sm text-text-dim"
            style={{ fontFamily: 'Sora_400Regular' }}
          >
            Recorrência não encontrada.
          </Text>
        ) : (
          <>
            <Hero recurrent={recurrent} paidCount={paidCount} />
            {recurrent.installments_total ? (
              <InstallmentsCard recurrent={recurrent} paidCount={paidCount} />
            ) : null}
            <MetaCard recurrent={recurrent} />
            <ActionBlock
              recurrent={recurrent}
              paidCount={paidCount}
              onConclude={conclude}
              onReopen={reopen}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

function Hero({
  recurrent,
  paidCount,
}: {
  recurrent: IRecurrentsTRow;
  paidCount: number;
}) {
  const isConcluded = recurrent.concluded === 1;
  const hasInstallments = recurrent.installments_total !== null;
  const heroValue = isConcluded
    ? recurrent.base_value * (recurrent.installments_total ?? 1)
    : recurrent.base_value;
  const heroSub = isConcluded
    ? `total pago em ${recurrent.installments_total ?? 1} parcela${(recurrent.installments_total ?? 1) === 1 ? '' : 's'}`
    : hasInstallments
      ? `valor de cada parcela · ${Math.max((recurrent.installments_total ?? 0) - paidCount, 0)} restante${(recurrent.installments_total ?? 0) - paidCount === 1 ? '' : 's'}`
      : `cobrado todo dia ${String(recurrent.due_day).padStart(2, '0')}`;

  return (
    <Card className="items-center px-5 py-6">
      {isCatKind(recurrent.category_icon) ? (
        <CatIcon kind={recurrent.category_icon} size={56} />
      ) : (
        <View className="h-14 w-14 items-center justify-center rounded-tile bg-surface-2" />
      )}
      <Text
        numberOfLines={2}
        className="mt-3 text-center text-base text-text"
        style={{ fontFamily: 'Sora_700Bold' }}
      >
        {recurrent.description || recurrent.category_name}
      </Text>
      <View className="mt-2">
        <StatusPill recurrent={recurrent} paidCount={paidCount} />
      </View>
      <View className="mt-3">
        <Money value={heroValue / 100} className="text-3xl text-text" bold />
      </View>
      <Text
        className="mt-1 text-xs text-text-dim"
        style={{ fontFamily: 'Sora_400Regular' }}
      >
        {heroSub}
      </Text>
    </Card>
  );
}

function StatusPill({
  recurrent,
  paidCount,
}: {
  recurrent: IRecurrentsTRow;
  paidCount: number;
}) {
  if (recurrent.concluded === 1) {
    return (
      <Pill tone="income">
        <CheckIcon size={12} color="#3CC85F" weight="bold" />
        Concluída
      </Pill>
    );
  }
  if (recurrent.installments_total !== null) {
    return (
      <Pill tone="neutral">
        <ArrowsClockwiseIcon size={12} color="#FFFFFF" weight="bold" />
        Em andamento · {paidCount}/{recurrent.installments_total}
      </Pill>
    );
  }
  return (
    <Pill tone="neutral">
      <ArrowsClockwiseIcon size={12} color="#FFFFFF" weight="bold" />
      Ativa · sem prazo
    </Pill>
  );
}

function InstallmentsCard({
  recurrent,
  paidCount,
}: {
  recurrent: IRecurrentsTRow;
  paidCount: number;
}) {
  const total = recurrent.installments_total ?? 0;
  const paid = Math.min(paidCount, total);
  const remaining = Math.max(total - paid, 0);
  const totalPaid = recurrent.base_value * paid;
  const isConcluded = recurrent.concluded === 1;

  return (
    <Card className="mt-3 p-5">
      <View className="flex-row items-baseline justify-between">
        <Text
          className="text-xs text-text-mute"
          style={{
            fontFamily: 'Sora_700Bold',
            letterSpacing: 1.1,
            textTransform: 'uppercase',
          }}
        >
          Parcelas
        </Text>
        <Text
          className="text-sm text-text"
          style={{ fontFamily: 'JetBrainsMono_700Bold' }}
        >
          {paid}/{total} {paid === 1 ? 'paga' : 'pagas'}
        </Text>
      </View>

      <View className="mt-3 flex-row gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={`p-${i}`}
            className={`h-2 flex-1 rounded ${
              i < paid
                ? isConcluded
                  ? 'bg-income'
                  : 'bg-text'
                : 'bg-surface-2'
            }`}
          />
        ))}
      </View>

      <View className="mt-3 flex-row gap-2.5">
        <MiniStat
          label={isConcluded ? 'Total pago' : 'Já pago'}
          value={
            <Money value={totalPaid / 100} className="text-sm text-text" bold />
          }
        />
        <MiniStat
          label={isConcluded ? 'Concluído' : 'A pagar'}
          value={
            isConcluded ? (
              <Text
                className="text-sm text-text"
                style={{ fontFamily: 'Sora_700Bold' }}
              >
                sim
              </Text>
            ) : (
              <Money
                value={(recurrent.base_value * remaining) / 100}
                className="text-sm text-text"
                bold
              />
            )
          }
        />
      </View>

      <Text
        className="mt-3 text-xs text-text-dim"
        style={{ fontFamily: 'Sora_400Regular' }}
      >
        {total}× de{' '}
        {(recurrent.base_value / 100).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
        , todo dia {String(recurrent.due_day).padStart(2, '0')}.
      </Text>
    </Card>
  );
}

function MiniStat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <View className="flex-1 rounded-tile border border-border-subtle bg-surface-2 px-3 py-2.5">
      <Text
        className="text-[11px] text-text-dim"
        style={{
          fontFamily: 'Sora_700Bold',
          letterSpacing: 1.1,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
      <View className="mt-1">{value}</View>
    </View>
  );
}

function MetaRow({
  label,
  value,
  isLast,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <View
      className={`flex-row items-center justify-between px-4 py-3 ${isLast ? '' : 'border-b border-border-subtle'}`}
    >
      <Text
        className="text-xs text-text-mute"
        style={{ fontFamily: 'Sora_600SemiBold' }}
      >
        {label}
      </Text>
      <Text
        numberOfLines={1}
        className="text-right text-sm text-text"
        style={{ fontFamily: 'Sora_700Bold' }}
      >
        {value}
      </Text>
    </View>
  );
}

function MetaCard({ recurrent }: { recurrent: IRecurrentsTRow }) {
  const isConcluded = recurrent.concluded === 1;
  const hasInstallments = recurrent.installments_total !== null;
  return (
    <View className="mt-4">
      <Text
        className="mb-2 px-1 text-xs text-text-mute"
        style={{
          fontFamily: 'Sora_700Bold',
          letterSpacing: 1.1,
          textTransform: 'uppercase',
        }}
      >
        {isConcluded ? 'Período' : 'Detalhes'}
      </Text>
      <Card className="p-0">
        <MetaRow label="Categoria" value={recurrent.category_name} />
        <MetaRow
          label="Tipo"
          value={recurrent.type === 'income' ? 'Entrada' : 'Saída'}
        />
        <MetaRow
          label="Status"
          value={
            isConcluded
              ? 'Concluída'
              : hasInstallments
                ? 'Em andamento'
                : 'Ativa, sem fim definido'
          }
        />
        <MetaRow
          label="Dia da cobrança"
          value={`Todo dia ${String(recurrent.due_day).padStart(2, '0')}`}
          isLast
        />
      </Card>
    </View>
  );
}

function ActionBlock({
  recurrent,
  paidCount,
  onConclude,
  onReopen,
}: {
  recurrent: IRecurrentsTRow;
  paidCount: number;
  onConclude: () => Promise<void>;
  onReopen: () => Promise<void>;
}) {
  const isConcluded = recurrent.concluded === 1;
  const hasInstallments = recurrent.installments_total !== null;
  const remaining = hasInstallments
    ? Math.max((recurrent.installments_total ?? 0) - paidCount, 0)
    : 0;

  return (
    <View className="mt-6">
      {isConcluded ? (
        <>
          <Button onPress={onReopen} text="Abrir recorrência novamente" />
          <Text
            className="mt-2 text-center text-[11px] text-text-mute"
            style={{ fontFamily: 'Sora_400Regular' }}
          >
            Volta para a lista de recorrências ativas — continua cobrando todo
            mês.
          </Text>
        </>
      ) : (
        <>
          <Button onPress={onConclude} text="Concluir recorrência" />
          <Text
            className="mt-2 text-center text-[11px] text-text-mute"
            style={{ fontFamily: 'Sora_400Regular' }}
          >
            {hasInstallments
              ? `Marca as ${remaining} parcela${remaining === 1 ? '' : 's'} restante${remaining === 1 ? '' : 's'} como concluída${remaining === 1 ? '' : 's'} e move para o histórico.`
              : 'Move esta recorrência para o histórico de concluídas.'}
          </Text>
        </>
      )}
    </View>
  );
}
