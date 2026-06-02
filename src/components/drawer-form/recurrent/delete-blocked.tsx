import { Button } from '@/components/ui/button';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface RecurrentDeleteBlockedFormProps {
  count: number;
  onClose: () => void;
}

/**
 * Drawer body shown when the user tries to delete a recurrent that has at
 * least one linked transaction. Pure info — the only action is dismiss.
 */
export function RecurrentDeleteBlockedForm({
  count,
  onClose,
}: RecurrentDeleteBlockedFormProps) {
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
