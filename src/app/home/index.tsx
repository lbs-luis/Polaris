import { InvoiceSnackbar } from '@/components/ui/invoice-snackbar';
import { ScannerButton } from '@/components/ui/scanner-button';
import { TransactionRow } from '@/components/ui/transaction-row';
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
      <Text
        style={{ fontFamily: 'Sora_700Bold' }}
        className="mt-6 text-3xl text-text-primary"
      >
        Ínicio
      </Text>
      <Text
        style={{ fontFamily: 'Sora_400Regular' }}
        className="mt-6 text-lg text-text-primary/60"
      >
        Transações
      </Text>

      <ScrollView className="mt-6 flex flex-1 flex-col">
        {transactions.length === 0 ? (
          <Text
            style={{ fontFamily: 'Sora_400Regular' }}
            className="mt-6 text-center text-sm  text-text-secondary"
          >
            Nenhuma transação registrada.
          </Text>
        ) : (
          transactions.map((t, i) => (
            <TransactionRow key={`${i}-${t.id}`} transaction={t} />
          ))
        )}
      </ScrollView>

      <InvoiceSnackbar state={state} />

      {!isProcessing && <ScannerButton onConfirm={handleConfirm} />}
    </View>
  );
}
