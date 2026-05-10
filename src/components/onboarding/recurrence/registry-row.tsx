import { IRecurrentsTRow } from '@/database/tables/recurrents.table';
import { formatCurrency } from '@/libs/masks';
import { cn } from '@/libs/utils';
import { Text, View } from 'react-native';

export function RecurrencyRow({ item: registry }: { item: IRecurrentsTRow }) {
  return (
    <View className="mb-2 flex flex-row items-center rounded-xl  border border-border-default px-3 py-2">
      <View className="self-start rounded-lg bg-surface-primary px-1.5 py-1">
        <Text
          className="text-text-primary"
          style={{ fontFamily: 'Sora_400Regular' }}
        >
          {registry.due_day}
        </Text>
      </View>
      <Text
        className="ml-3 text-sm text-text-primary"
        style={{ fontFamily: 'Sora_400Regular' }}
      >
        {registry.category_name}
      </Text>
      <Text
        className={cn(
          'ml-3 text-sm',
          registry.type === 'income' ? 'text-income' : 'text-outcome'
        )}
        style={{ fontFamily: 'Sora_400Regular' }}
      >
        {formatCurrency(registry.base_value.toString())}
      </Text>
    </View>
  );
}
