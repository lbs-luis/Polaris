import { ITransactionsTRow } from '@/database/tables/transactions.table';
import { formatCurrency } from '@/libs/masks';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

export function TransactionRow({
  transaction,
}: {
  transaction: ITransactionsTRow;
}) {
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
            {transaction.due_day}
          </Text>
        </View>
        <Text
          className="ml-3 text-sm text-text-primary"
          style={{ fontFamily: 'Sora_400Regular' }}
        >
          {transaction.description}
        </Text>
        <Text
          className={'ml-3 text-sm text-text-primary/80'}
          style={{ fontFamily: 'Sora_400Regular' }}
        >
          {formatCurrency(transaction.value.toString())}
        </Text>
      </BlurView>
    </View>
  );
}
