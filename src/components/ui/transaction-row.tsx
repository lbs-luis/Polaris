import { CatIcon, isCatKind } from '@/components/ui/cat-icon';
import { Money } from '@/components/ui/money';
import { ITransactionsTRow } from '@/database/tables/transactions.table';
import { formatTransactionTime } from '@/libs/dates';
import { Text, View } from 'react-native';

interface TransactionRowProps {
  transaction: ITransactionsTRow;
  isFirst?: boolean;
}

/**
 * Canonical transaction row: CatIcon · description · time · signed amount.
 * Matches the kit ListRow footprint (CatIcon 44, inset hairline divider) so it
 * drops into a ListGroup and looks identical everywhere it's used.
 */
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

  const valueColor = signedValue >= 0 ? 'text-income' : 'text-text';

  return (
    <View className="bg-surface">
      {!isFirst ? (
        <View className="h-px bg-border-subtle" style={{ marginLeft: 74 }} />
      ) : null}
      <View className="flex-row items-center gap-3.5 px-[18px] py-[15px]">
        {isCatKind(transaction.category_icon) ? (
          <CatIcon kind={transaction.category_icon} size={44} />
        ) : (
          <View className="h-11 w-11 items-center justify-center rounded-tile bg-surface-2">
            <Text
              className="text-sm text-text-dim"
              style={{ fontFamily: 'Sora_700Bold' }}
            >
              {transaction.description?.[0]?.toUpperCase() ?? '?'}
            </Text>
          </View>
        )}
        <View className="min-w-0 flex-1">
          <Text
            numberOfLines={1}
            className="text-base text-text"
            style={{ fontFamily: 'Sora_600SemiBold', letterSpacing: -0.1 }}
          >
            {transaction.description ?? 'Sem descrição'}
          </Text>
          <Text
            numberOfLines={1}
            className="mt-0.5 text-[13.5px] text-text-dim"
            style={{ fontFamily: 'Sora_400Regular' }}
          >
            {subtitle}
          </Text>
        </View>
        <Money
          value={signedValue}
          sign
          bold
          className={`text-[15px] ${valueColor}`}
        />
      </View>
    </View>
  );
}
