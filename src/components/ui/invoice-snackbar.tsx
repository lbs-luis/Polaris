import { ActivityIndicator, Text, View } from 'react-native';
import { ProcessorState } from '@/hooks/use-invoice-processor';

interface InvoiceSnackbarProps {
  state: ProcessorState;
}

export function InvoiceSnackbar({ state }: InvoiceSnackbarProps) {
  if (state.status === 'idle') return null;

  if (state.status === 'done') {
    const errors = state.results.filter((r) => r[1] !== null).length;
    const success = state.results.filter((r) => r[0] !== null).length;

    return (
      <View className="absolute bottom-4 left-4 right-4 z-30 rounded-2xl bg-surface-secondary/95 px-4 py-3">
        <Text className="text-center text-sm font-medium text-text-primary">
          {success > 0 && `${success} nota(s) salva(s)`}
          {success > 0 && errors > 0 && ' • '}
          {errors > 0 && `${errors} erro(s)`}
        </Text>
      </View>
    );
  }

  return (
    <View className="absolute bottom-4 left-4 right-4 z-30 flex-row items-center justify-between rounded-2xl bg-surface-secondary/95 px-4 py-3">
      <Text className="text-sm font-medium text-text-primary">
        Processando nota {state.done}/{state.total}
      </Text>
      <ActivityIndicator size="small" color="#F7B731" />
    </View>
  );
}
