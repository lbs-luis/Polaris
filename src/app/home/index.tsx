import { ScannerButton } from '@/components/ui/scanner-button';
import { fetchInvoice, ParsedInvoice } from '@/services/invoice.service';
import { useTransactionsTable } from '@/database/tables/transactions.table';
import { useEffect, useState, useCallback } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { list } = useTransactionsTable();
  const [transactions, setTransactions] = useState<
    Awaited<ReturnType<typeof list>>
  >([]);
  const [scannedInvoice, setScannedInvoice] = useState<ParsedInvoice | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const date = new Date();

  useEffect(() => {
    list(date.getMonth() + 1, date.getFullYear()).then(setTransactions);
  }, [list]);

  const handleScan = useCallback(async (url: string) => {
    setIsLoading(true);
    try {
      const result = await fetchInvoice(url);
      setScannedInvoice(result);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Erro desconhecido ao processar nota fiscal.';
      Alert.alert('Erro no escaneamento', message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <View className="flex flex-1 flex-col bg-app-bg p-6">
      <Text className="text-3xl font-extrabold text-text-accent">Início</Text>
      <Text className="mt-2 text-base font-medium text-text-secondary">
        Transações do mês
      </Text>

      {isLoading && (
        <View className="mt-4 rounded-xl bg-surface-secondary p-4">
          <Text className="text-center text-base text-text-primary">
            Processando nota fiscal...
          </Text>
        </View>
      )}

      <ScrollView className="mt-6 flex flex-1 flex-col">
        {transactions.length === 0 ? (
          <Text className="text-center text-base text-text-secondary">
            Nenhuma transação confirmada este mês.
          </Text>
        ) : (
          transactions.map((t) => (
            <View
              key={t.id}
              className="mb-3 flex flex-row items-center justify-between rounded-xl bg-surface-secondary p-4"
            >
              <Text className="text-base font-medium text-text-primary">
                {t.month}/{t.year}
              </Text>
              <Text className="text-base font-semibold text-text-primary">
                R$ {(t.value / 100).toFixed(2).replace('.', ',')}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <ScannerButton onScan={handleScan} />

      {scannedInvoice && (
        <View className="absolute inset-0 z-30 flex flex-col justify-center bg-black/90 p-6">
          <Text className="mb-4 text-2xl font-extrabold text-white">
            Nota Fiscal
          </Text>

          <View className="mb-2">
            <Text className="text-sm text-gray-400">Estabelecimento</Text>
            <Text className="text-base font-medium text-white">
              {scannedInvoice.establishment_name}
            </Text>
          </View>

          <View className="mb-2">
            <Text className="text-sm text-gray-400">CNPJ</Text>
            <Text className="text-base font-medium text-white">
              {scannedInvoice.cnpj || 'Não identificado'}
            </Text>
          </View>

          <View className="mb-2">
            <Text className="text-sm text-gray-400">Data de Emissão</Text>
            <Text className="text-base font-medium text-white">
              {scannedInvoice.issued_at || 'Não identificada'}
            </Text>
          </View>

          <View className="mb-2">
            <Text className="text-sm text-gray-400">Valor Total</Text>
            <Text className="text-base font-semibold text-white">
              R${' '}
              {(scannedInvoice.total_value / 100).toFixed(2).replace('.', ',')}
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-sm text-gray-400">Chave de Acesso</Text>
            <Text className="text-xs text-white">
              {scannedInvoice.chave_acesso}
            </Text>
          </View>

          <TouchableOpacity
            className="rounded-full bg-app-accent py-4"
            onPress={() => setScannedInvoice(null)}
            activeOpacity={0.8}
          >
            <Text className="text-center text-base font-extrabold uppercase text-app-accent-muted">
              Fechar
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
