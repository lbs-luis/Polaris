import { Card } from '@/components/ui/card';
import { Money } from '@/components/ui/money';
import { IRecurrentsTRow } from '@/database/tables/recurrents.table';
import { useRouter } from 'expo-router';
import { ArrowsClockwiseIcon, CaretRightIcon } from 'phosphor-react-native';
import { Pressable, Text, View } from 'react-native';

interface DetailRecurrentMetaProps {
  recurrent: IRecurrentsTRow;
}

export function DetailRecurrentMeta({ recurrent }: DetailRecurrentMetaProps) {
  const router = useRouter();
  const accent = recurrent.type === 'income' ? 'text-income' : 'text-outcome';

  return (
    <View className="mt-4">
      <Text
        className="mb-2 px-1 text-xs text-text-mute"
        style={{ fontFamily: 'Sora_700Bold' }}
      >
        RECORRÊNCIA
      </Text>
      <Card className="p-0">
        <View className="flex-row items-center gap-3 border-b border-border-subtle px-4 py-3">
          <View className="h-9 w-9 items-center justify-center rounded-tile bg-surface-2">
            <ArrowsClockwiseIcon size={18} color="#FFFFFF" weight="bold" />
          </View>
          <View className="flex-1">
            <Text
              className="text-sm text-text"
              style={{ fontFamily: 'Sora_700Bold' }}
            >
              {recurrent.category_name}
            </Text>
            <Text
              className="mt-0.5 text-xs text-text-dim"
              style={{ fontFamily: 'Sora_400Regular' }}
            >
              Todo dia {recurrent.due_day}
            </Text>
          </View>
          <Money
            value={recurrent.base_value / 100}
            className={`text-sm ${accent}`}
            bold
          />
        </View>
        <Pressable
          onPress={() => router.push('/recurrence')}
          className="flex-row items-center justify-between px-4 py-3"
        >
          <Text
            className="text-sm text-text"
            style={{ fontFamily: 'Sora_600SemiBold' }}
          >
            Gerenciar recorrências
          </Text>
          <CaretRightIcon size={16} color="#5E5E66" weight="bold" />
        </Pressable>
      </Card>
    </View>
  );
}
