import { EditTransactionForm } from '@/components/drawer-form/transaction/edit';
import { NavHeader } from '@/components/layout/nav-header';
import { ActionBar } from '@/components/ui/action-bar';
import { CatIcon, isCatKind } from '@/components/ui/cat-icon';
import { DetailHero } from '@/components/ui/detail-hero';
import { ListGroup, ListRow, Section } from '@/components/ui/list';
import { MetaRow } from '@/components/ui/meta-row';
import { Money } from '@/components/ui/money';
import { Pill } from '@/components/ui/pill';
import { useBottomSheetContext } from '@/context/bottomsheet.context';
import { IInvoiceItem } from '@/database/tables/invoices.table';
import { ITransactionsTRow } from '@/database/tables/transactions.table';
import { useTransactionDetail } from '@/hooks/view-models/use-transaction-detail';
import { formatInvoiceDateTime, formatRelativeDate } from '@/libs/dates';
import { theme } from '@/libs/theme';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowsClockwiseIcon,
  PencilSimpleIcon,
  ReceiptIcon,
  TagIcon,
  TrashIcon,
} from 'phosphor-react-native';
import { useCallback } from 'react';
import { Alert, Linking, ScrollView, Text, View } from 'react-native';

function signedAmount(transaction: ITransactionsTRow): number {
  return transaction.category_type === 'outcome'
    ? -Math.abs(transaction.value) / 100
    : transaction.value / 100;
}

function dateLabelFor(transaction: ITransactionsTRow): string {
  if (transaction.issued_at) {
    const formatted = formatInvoiceDateTime(transaction.issued_at);
    if (formatted) return formatted;
  }
  if (transaction.due_day) {
    return formatRelativeDate(
      transaction.due_day,
      transaction.month,
      transaction.year
    );
  }
  return `${transaction.month}/${transaction.year}`;
}

function formatQuantity(quantity: number): string {
  return Number.isInteger(quantity)
    ? String(quantity)
    : quantity.toFixed(2).replace('.', ',');
}

function CategoryGlyph({ icon, size }: { icon: string | null; size: number }) {
  if (isCatKind(icon)) return <CatIcon kind={icon} size={size} />;
  return (
    <View
      className="items-center justify-center rounded-tile bg-surface-2"
      style={{ width: size, height: size }}
    >
      <TagIcon size={size * 0.5} color={theme.textDim} weight="regular" />
    </View>
  );
}

function InvoiceItemRow({
  item,
  divider,
}: {
  item: IInvoiceItem;
  divider: boolean;
}) {
  return (
    <View className="bg-surface">
      {divider ? <View className="ml-[18px] h-px bg-border-subtle" /> : null}
      <View className="flex-row items-center gap-3 px-[18px] py-3.5">
        <Text
          className="flex-1 text-sm text-text"
          style={{ fontFamily: 'Sora_400Regular' }}
        >
          {item.desc}
        </Text>
        <Text
          className="text-sm text-text-dim"
          style={{
            fontFamily: 'JetBrainsMono_500Medium',
            fontVariant: ['tabular-nums'],
          }}
        >
          ×{formatQuantity(item.qty)}
        </Text>
      </View>
    </View>
  );
}

export default function TransactionDetailScreen() {
  const router = useRouter();
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const id = Number(idParam);

  const {
    transaction,
    invoice,
    recurrent,
    items,
    isLoading,
    remove,
    update,
    refreshTransaction,
  } = useTransactionDetail(Number.isFinite(id) ? id : -1);
  const { openBottomSheet, closeBottomSheet } = useBottomSheetContext();

  useFocusEffect(
    useCallback(() => {
      void refreshTransaction();
    }, [refreshTransaction])
  );

  function openEditSheet() {
    if (!transaction) return;
    openBottomSheet(
      <EditTransactionForm
        transaction={transaction}
        onUpdate={update}
        onSaved={async () => {
          closeBottomSheet();
          await refreshTransaction();
        }}
      />,
      { title: 'Editar lançamento' }
    );
  }

  function confirmDelete() {
    Alert.alert(
      'Excluir lançamento',
      'Esta ação não pode ser desfeita. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await remove();
            router.back();
          },
        },
      ]
    );
  }

  return (
    <View className="flex-1 bg-bg">
      <NavHeader back />

      {isLoading ? (
        <Text
          className="mt-12 text-center text-sm text-text-dim"
          style={{ fontFamily: 'Sora_400Regular' }}
        >
          Carregando...
        </Text>
      ) : !transaction ? (
        <Text
          className="mt-12 text-center text-sm text-text-dim"
          style={{ fontFamily: 'Sora_400Regular' }}
        >
          Lançamento não encontrado.
        </Text>
      ) : (
        <>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 8,
              paddingBottom: 24,
            }}
            showsVerticalScrollIndicator={false}
          >
            <DetailHero
              icon={
                <CategoryGlyph icon={transaction.category_icon} size={66} />
              }
              title={
                transaction.description ?? invoice?.merchant ?? 'Lançamento'
              }
              pill={
                invoice ? (
                  <Pill tone="brand" icon={ReceiptIcon}>
                    Nota fiscal
                  </Pill>
                ) : recurrent ? (
                  <Pill tone="brand" icon={ArrowsClockwiseIcon}>
                    Recorrência
                  </Pill>
                ) : (
                  <Pill tone="neutral">Manual</Pill>
                )
              }
              amount={signedAmount(transaction)}
              caption={dateLabelFor(transaction)}
            />

            <Section className="mt-5">Categoria</Section>
            <ListGroup>
              <ListRow
                left={
                  <CategoryGlyph icon={transaction.category_icon} size={44} />
                }
                title={transaction.category_name ?? 'Sem categoria'}
                right={
                  <PencilSimpleIcon
                    size={16}
                    color={theme.textDim}
                    weight="bold"
                  />
                }
                onPress={openEditSheet}
              />
            </ListGroup>

            {invoice && items.length > 0 ? (
              <>
                <Section
                  className="mt-5"
                  right={`${items.length} ${items.length === 1 ? 'item' : 'itens'}`}
                >
                  Itens da nota
                </Section>
                <ListGroup>
                  {items.map((item, index) => (
                    <InvoiceItemRow
                      key={`${item.desc}-${index}`}
                      item={item}
                      divider={index > 0}
                    />
                  ))}
                  <View className="bg-surface">
                    <View className="ml-[18px] h-px bg-border-subtle" />
                    <View className="flex-row items-center justify-between px-[18px] py-3.5">
                      <Text
                        className="text-sm text-text-dim"
                        style={{ fontFamily: 'Sora_700Bold' }}
                      >
                        Total
                      </Text>
                      <Money
                        value={invoice.total / 100}
                        bold
                        className="text-base text-text"
                      />
                    </View>
                  </View>
                </ListGroup>
              </>
            ) : null}

            <Section className="mt-5">Detalhes</Section>
            <ListGroup>
              <MetaRow label="Data" value={dateLabelFor(transaction)} />
              {invoice?.payment_method ? (
                <MetaRow
                  label="Forma de pagamento"
                  value={invoice.payment_method}
                  divider
                />
              ) : null}
              {invoice ? (
                <MetaRow
                  label="Estabelecimento"
                  value={invoice.merchant}
                  divider
                />
              ) : null}
              {invoice ? (
                <MetaRow label="CNPJ" value={invoice.cnpj} divider />
              ) : null}
              {invoice?.qrcode_url ? (
                <MetaRow
                  label="Nota fiscal"
                  value="Ver NFC-e"
                  link
                  divider
                  onPress={() => Linking.openURL(invoice.qrcode_url)}
                />
              ) : null}
            </ListGroup>

            {recurrent ? (
              <>
                <Section className="mt-5">Recorrência</Section>
                <ListGroup>
                  <ListRow
                    left={
                      <CategoryGlyph icon={recurrent.category_icon} size={44} />
                    }
                    title={recurrent.category_name ?? 'Recorrência'}
                    sub={`Todo dia ${recurrent.due_day}`}
                    right={
                      <Money
                        value={recurrent.base_value / 100}
                        bold
                        className={`text-[15px] ${recurrent.type === 'income' ? 'text-income' : 'text-text'}`}
                      />
                    }
                  />
                  <ListRow
                    divider
                    title="Gerenciar recorrências"
                    chevron
                    onPress={() => router.push('/recurrence')}
                  />
                </ListGroup>
              </>
            ) : null}
          </ScrollView>

          <ActionBar
            actions={[
              {
                label: 'Excluir',
                icon: TrashIcon,
                danger: true,
                onPress: confirmDelete,
              },
              {
                label: 'Editar',
                icon: PencilSimpleIcon,
                primary: true,
                onPress: openEditSheet,
              },
            ]}
          />
        </>
      )}
    </View>
  );
}
