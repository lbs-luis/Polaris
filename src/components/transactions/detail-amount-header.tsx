import { CatIcon, isCatKind } from '@/components/ui/cat-icon';
import { Money } from '@/components/ui/money';
import { ITransactionsTRow } from '@/database/tables/transactions.table';
import { Text, View } from 'react-native';

interface DetailAmountHeaderProps {
  transaction: ITransactionsTRow;
}

export function DetailAmountHeader({ transaction }: DetailAmountHeaderProps) {
  const signed =
    transaction.category_type === 'outcome'
      ? -Math.abs(transaction.value) / 100
      : transaction.value / 100;

  const amountClass =
    signed >= 0 ? 'text-3xl text-income' : 'text-3xl text-text';

  return (
    <View className="items-center pb-4 pt-2">
      {isCatKind(transaction.category_icon) ? (
        <CatIcon kind={transaction.category_icon} size={56} />
      ) : (
        <View className="h-14 w-14 items-center justify-center rounded-tile bg-surface-2">
          <Text
            className="text-base text-text-dim"
            style={{ fontFamily: 'Sora_700Bold' }}
          >
            {transaction.description?.[0]?.toUpperCase() ?? '?'}
          </Text>
        </View>
      )}
      <Text
        numberOfLines={1}
        className="mt-3 max-w-[80%] text-center text-base text-text"
        style={{ fontFamily: 'Sora_700Bold' }}
      >
        {transaction.description ?? 'Lançamento'}
      </Text>
      <Money value={signed} sign className={amountClass} bold />
    </View>
  );
}
