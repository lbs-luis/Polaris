import { CatIcon, isCatKind } from '@/components/ui/cat-icon';
import { Money } from '@/components/ui/money';
import { SwipeableRow } from '@/components/ui/swipeable-row';
import { ITransactionsTRow } from '@/database/tables/transactions.table';
import { formatTransactionTime } from '@/libs/dates';
import { rowRadiusClass } from '@/libs/list-radius';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

interface TransactionListRowProps {
  transaction: ITransactionsTRow;
  index: number;
  total: number;
  onEdit: (t: ITransactionsTRow) => void;
  onDelete: (id: number) => void;
}

/**
 * Tappable + swipeable variant of TransactionRow used on the dedicated
 * Transações route. Wraps the standard row in a SwipeableRow so the user
 * can reveal the Editar / Excluir actions, and routes to the detail page
 * on tap. The first/last row gets dynamic corner rounding so the bottom-
 * /top-most rounded edges of the parent Card stay clean during the swipe
 * (the Card cannot use overflow-hidden — it would clip the swipe reveal).
 */
export function TransactionListRow({
  transaction,
  index,
  total,
  onEdit,
  onDelete,
}: TransactionListRowProps) {
  const router = useRouter();

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
    signedValue >= 0 ? 'text-[15px] text-income' : 'text-[15px] text-text';

  return (
    <SwipeableRow
      index={index}
      total={total}
      onEdit={() => onEdit(transaction)}
      onDelete={() => onDelete(transaction.id)}
    >
      <Pressable
        onPress={() => router.push(`/transactions/${transaction.id}`)}
        className={`flex-row items-center gap-3.5 bg-surface px-[18px] py-[15px] ${rowRadiusClass(index, total)} ${index === 0 ? '' : 'border-t border-border-subtle'}`}
      >
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
        <Money value={signedValue} sign className={valueClass} bold />
      </Pressable>
    </SwipeableRow>
  );
}
