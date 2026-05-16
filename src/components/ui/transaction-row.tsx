import { CatIcon, isCatKind } from '@/components/ui/cat-icon';
import { Money } from '@/components/ui/money';
import { ITransactionsTRow } from '@/database/tables/transactions.table';
import { formatTransactionTime } from '@/libs/dates';
import { Text, View } from 'react-native';

interface TransactionRowProps {
  transaction: ITransactionsTRow;
  isFirst?: boolean;
}

export function TransactionRow({ transaction, isFirst }: TransactionRowProps) {
  const signedValue =
    transaction.category_type === 'outcome'
      ? -Math.abs(transaction.value) / 100
      : transaction.value / 100;

  const subtitle = formatTransactionTime(
    transaction.issued_at,
    transaction.due_day,
    transaction.month,
    transaction.year
  );

  const valueClass =
    signedValue >= 0 ? 'text-sm text-income' : 'text-sm text-text';

  return (
    <View
      className={`flex-row items-center gap-3 px-3.5 py-3 ${isFirst ? '' : 'border-t border-border-subtle'}`}
    >
      {isCatKind(transaction.category_icon) ? (
        <CatIcon kind={transaction.category_icon} size={36} />
      ) : (
        <View className="h-9 w-9 items-center justify-center rounded-tile bg-surface-2">
          <Text
            className="text-xs text-text-dim"
            style={{ fontFamily: 'Sora_700Bold' }}
          >
            {transaction.description?.[0]?.toUpperCase() ?? '?'}
          </Text>
        </View>
      )}
      <View className="flex-1">
        <Text
          numberOfLines={1}
          className="text-sm text-text"
          style={{ fontFamily: 'Sora_700Bold' }}
        >
          {transaction.description ?? 'Sem descrição'}
        </Text>
        <Text
          className="mt-0.5 text-xs text-text-dim"
          style={{ fontFamily: 'Sora_400Regular' }}
        >
          {subtitle}
        </Text>
      </View>
      <Money value={signedValue} sign className={valueClass} bold />
    </View>
  );
}
