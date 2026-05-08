import { IRecurrentsTRow } from '@/database/tables/recurrents.table';
import { formatCurrency } from '@/libs/masks';
import { cn } from '@/libs/utils';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

export function RecurrencyRow({ registry }: { registry: IRecurrentsTRow }) {
  return (
    <View className="mt-2 w-full">
      <LinearGradient
        colors={[
          'rgba(45,45,52,0.6)',
          'rgba(29,29,32,0.4)',
          'rgba(20,20,24,0.5)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 20,
        }}
      />
      <BlurView
        intensity={80}
        tint="dark"
        style={{
          borderRadius: 14,
          overflow: 'hidden',
          borderWidth: 0.5,
          borderColor: 'rgba(255,255,255,0.08)',
          backgroundColor: 'rgba(29,29,32,0.3)',
          paddingHorizontal: 10,
          paddingVertical: 12,
        }}
        className="flex flex-row items-center"
      >
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
      </BlurView>
    </View>
  );
}
