import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Money } from '@/components/ui/money';
import { cn } from '@/libs/utils';
import { Text, View } from 'react-native';

interface MovementCardProps {
  month: string;
  income: number;
  outcome: number;
  net: number;
  className?: string;
}

export function MovementCard({
  month,
  income,
  outcome,
  net,
  className,
}: MovementCardProps) {
  const total = income + outcome;

  return (
    <Card className={cn('p-5', className)}>
      <View className="flex-row items-start justify-between">
        <View>
          <Label label={`Movimento · ${month}`} uppercase={false} />
          <Text
            className="mt-1.5 text-[13px] text-text-dim"
            style={{ fontFamily: 'Sora_400Regular' }}
          >
            Resultado do mês
          </Text>
        </View>
        <Money
          value={net}
          sign
          className={net >= 0 ? 'text-xl text-income' : 'text-xl text-outcome'}
          bold
        />
      </View>

      <View
        className="mt-5 flex-row overflow-hidden rounded-md bg-surface-2"
        style={{ height: 12 }}
      >
        {total > 0 ? (
          <>
            <View className="bg-income" style={{ flex: income }} />
            <View style={{ width: 2 }} />
            <View className="bg-outcome" style={{ flex: outcome }} />
          </>
        ) : null}
      </View>

      <View className="mt-3.5 flex-row justify-between gap-3">
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <View className="h-2 w-2 rounded-full bg-income" />
            <Text
              className="text-xs text-text-dim"
              style={{ fontFamily: 'Sora_400Regular' }}
            >
              Entradas
            </Text>
          </View>
          <View className="mt-1">
            <Money value={income} className="text-base text-income" bold />
          </View>
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <View className="h-2 w-2 rounded-full bg-outcome" />
            <Text
              className="text-xs text-text-dim"
              style={{ fontFamily: 'Sora_400Regular' }}
            >
              Saídas
            </Text>
          </View>
          <View className="mt-1">
            <Money value={outcome} className="text-base text-outcome" bold />
          </View>
        </View>
      </View>
    </Card>
  );
}
