import { NavHeader } from '@/components/layout/nav-header';
import { DetailAmountHeader } from '@/components/transactions/detail-amount-header';
import { DetailInvoiceItems } from '@/components/transactions/detail-invoice-items';
import { DetailInvoiceMeta } from '@/components/transactions/detail-invoice-meta';
import { DetailMetaCard } from '@/components/transactions/detail-meta-card';
import { DetailRecurrentMeta } from '@/components/transactions/detail-recurrent-meta';
import { useTransactionDetail } from '@/hooks/view-models/use-transaction-detail';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { TrashIcon } from 'phosphor-react-native';
import { useCallback } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

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
    refreshTransaction,
  } = useTransactionDetail(Number.isFinite(id) ? id : -1);

  useFocusEffect(
    useCallback(() => {
      void refreshTransaction();
    }, [refreshTransaction])
  );

  function handleDelete() {
    if (!transaction) return;
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
    <View className="flex-1 bg-bg pt-2">
      <NavHeader
        back
        title="Detalhes"
        right={
          transaction ? (
            <Pressable
              onPress={handleDelete}
              hitSlop={12}
              className="h-11 w-11 items-center justify-center"
            >
              <TrashIcon size={20} color="#FF4D4D" weight="bold" />
            </Pressable>
          ) : null
        }
      />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 48,
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
        ) : !transaction ? (
          <Text
            className="mt-12 text-center text-sm text-text-dim"
            style={{ fontFamily: 'Sora_400Regular' }}
          >
            Lançamento não encontrado.
          </Text>
        ) : (
          <>
            <DetailAmountHeader transaction={transaction} />
            <DetailMetaCard transaction={transaction} />
            {invoice ? (
              <View className="mt-4">
                <DetailInvoiceMeta invoice={invoice} />
                <DetailInvoiceItems
                  items={items}
                  taxTotal={invoice.tax_total}
                  total={invoice.total}
                />
              </View>
            ) : null}
            {recurrent ? <DetailRecurrentMeta recurrent={recurrent} /> : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}
