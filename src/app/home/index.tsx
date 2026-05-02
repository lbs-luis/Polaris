import { InvoiceSnackbar } from '@/components/ui/invoice-snackbar';
import { ScannerButton } from '@/components/ui/scanner-button';
import { useTransactionsTable } from '@/database/tables/transactions.table';
import { useInvoiceProcessor } from '@/hooks/use-invoice-processor';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function HomeScreen() {
  const { list } = useTransactionsTable();
  const { state, process } = useInvoiceProcessor();
  const [transactions, setTransactions] = useState<
    Awaited<ReturnType<typeof list>>
  >([]);

  useEffect(() => {
    list().then(setTransactions);
  }, [list]);

  useEffect(() => {
    if (state.status === 'done') {
      list().then(setTransactions);
    }
  }, [state.status, list]);

  const handleConfirm = useCallback(
    async (urls: string[]) => {
      await process(urls);
    },
    [process]
  );

  const isProcessing = state.status !== 'idle';

  return (
    <View className="flex flex-1 flex-col bg-app-bg p-6">
      <Text className="text-3xl font-extrabold text-text-accent">Início</Text>
      <Text className="mt-2 text-base font-medium text-text-secondary">
        Transações
      </Text>

      <ScrollView className="mt-6 flex flex-1 flex-col">
        {transactions.length === 0 ? (
          <Text className="text-center text-base text-text-secondary">
            Nenhuma transação registrada.
          </Text>
        ) : (
          transactions.map((t) => (
            <View
              key={t.id}
              className="mb-3 flex flex-row items-center justify-between rounded-xl bg-surface-secondary p-4"
            >
              <View className="flex flex-1 flex-row items-center gap-3">
                <Text className="text-sm font-medium text-text-secondary">
                  {t.due_day ?? '--'}
                </Text>
                <Text className="flex-1 text-base font-medium text-text-primary">
                  {t.description || 'Transação'}
                </Text>
              </View>
              <Text className="text-base font-semibold text-text-primary">
                R$ {(t.value / 100).toFixed(2).replace('.', ',')}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <InvoiceSnackbar state={state} />

      {!isProcessing && <ScannerButton onConfirm={handleConfirm} />}
    </View>
  );
}