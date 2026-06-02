import { Button } from '@/components/ui/button';
import { GhostButton } from '@/components/ui/ghost-button';
import { Money } from '@/components/ui/money';
import { CalendarDotsIcon, ReceiptIcon } from 'phosphor-react-native';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SameDayPromptFormProps {
  day: number;
  valueCents: number;
  installments?: number | null;
  isPastDay: boolean;
  onLaunchNow: () => Promise<void> | void;
  onWaitNextMonth: () => Promise<void> | void;
}

/**
 * Drawer body shown right after the user saves a brand-new recurrence
 * whose `due_day` is today (or already passed this month). Lets the user
 * pick between launching this month's transaction immediately or skipping
 * to next month's run.
 *
 * The caller is responsible for actually inserting the transaction +
 * bumping `first_fire_month`; this body just presents the choice.
 */
export function SameDayPromptForm({
  day,
  valueCents,
  installments,
  isPastDay,
  onLaunchNow,
  onWaitNextMonth,
}: SameDayPromptFormProps) {
  const insets = useSafeAreaInsets();
  const title = isPastDay
    ? `A cobrança deste mês foi no dia ${String(day).padStart(2, '0')}`
    : 'Lançar já a cobrança de hoje?';
  const body = isPastDay
    ? `A recorrência está marcada para todo dia ${String(day).padStart(2, '0')}, que já passou. Quer registrar a parcela deste mês agora ou esperar até o próximo mês?`
    : `A recorrência está marcada para todo dia ${String(day).padStart(2, '0')}, que é hoje. Quer registrar essa parcela agora ou esperar até o próximo mês?`;

  return (
    <View
      className="gap-4 px-6 pt-2"
      style={{ paddingBottom: 16 + insets.bottom }}
    >
      <View className="h-14 w-14 items-center justify-center rounded-tile border border-border-subtle bg-surface-2">
        <CalendarDotsIcon size={24} color="#FFFFFF" weight="bold" />
      </View>

      <View>
        <Text
          className="text-lg text-text"
          style={{ fontFamily: 'Sora_700Bold' }}
        >
          {title}
        </Text>
        <Text
          className="mt-2 text-sm text-text-dim"
          style={{ fontFamily: 'Sora_400Regular' }}
        >
          {body}
        </Text>
      </View>

      <View className="flex-row items-center gap-2.5 rounded-tile border border-border-subtle bg-surface-2 px-3.5 py-3">
        <ReceiptIcon size={18} color="#FFFFFF" weight="bold" />
        <View className="flex-1 flex-row items-center gap-1.5">
          <Money value={valueCents / 100} className="text-sm text-text" bold />
          {installments ? (
            <Text
              className="text-xs text-text-dim"
              style={{ fontFamily: 'Sora_400Regular' }}
            >
              · parcela 1 de {installments}
            </Text>
          ) : null}
        </View>
      </View>

      <View className="mt-1 gap-2.5">
        <Button onPress={onLaunchNow} text="Lançar hoje" />
        <GhostButton onPress={onWaitNextMonth} text="Aguardar próximo mês" />
      </View>
    </View>
  );
}
