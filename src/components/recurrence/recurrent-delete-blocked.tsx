import { Button } from '@/components/ui/button';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface RecurrentDeleteBlockedProps {
  count: number;
  onClose: () => void;
}

/**
 * Tiny info-only bottom-sheet body shown when the user tries to delete a
 * recurrent that already has transactions referencing it. The data model
 * doesn't yet support soft-delete or the "Concluir" toggle, so the only
 * action available here is to dismiss.
 */
export function RecurrentDeleteBlocked({
  count,
  onClose,
}: RecurrentDeleteBlockedProps) {
  const insets = useSafeAreaInsets();
  const noun = count === 1 ? 'transação' : 'transações';

  return (
    <View
      className="gap-3 px-6 pt-2"
      style={{ paddingBottom: 16 + insets.bottom }}
    >
      <Text
        className="text-sm text-text"
        style={{ fontFamily: 'Sora_700Bold' }}
      >
        Esta recorrência já gerou {count} {noun}.
      </Text>
      <Text
        className="text-xs text-text-dim"
        style={{ fontFamily: 'Sora_400Regular' }}
      >
        Para preservar seu histórico, recorrências com lançamentos vinculados
        não podem ser excluídas.
      </Text>
      <Button className="mt-3" onPress={onClose} text="Entendi" />
    </View>
  );
}
