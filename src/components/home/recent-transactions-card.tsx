import { Card } from '@/components/ui/card';
import { TransactionRow } from '@/components/ui/transaction-row';
import { ITransactionsTRow } from '@/database/tables/transactions.table';
import { Pressable, Text, View } from 'react-native';
import { TransactionRowSkeleton } from './transaction-row-skeleton';

interface RecentTransactionsCardProps {
  transactions: ITransactionsTRow[];
  isLoading?: boolean;
  onSeeAll?: () => void;
}

const SKELETON_COUNT = 4;

export function RecentTransactionsCard({
  transactions,
  isLoading,
  onSeeAll,
}: RecentTransactionsCardProps) {
  const showSkeleton = isLoading && transactions.length === 0;
  const showEmpty = !isLoading && transactions.length === 0;

  return (
    <View className="mt-5">
      <View className="flex-row items-center justify-between px-1 pb-3">
        <Text
          className="text-base text-text"
          style={{ fontFamily: 'Sora_700Bold' }}
        >
          Movimentações
        </Text>
        <Pressable onPress={onSeeAll}>
          <Text
            className="text-[13px] text-text"
            style={{ fontFamily: 'Sora_700Bold' }}
          >
            Ver tudo
          </Text>
        </Pressable>
      </View>
      <Card className="p-1.5">
        {showSkeleton &&
          Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <TransactionRowSkeleton key={`skeleton-${i}`} isFirst={i === 0} />
          ))}
        {showEmpty && (
          <View className="p-4">
            <Text
              className="text-center text-sm text-text-dim"
              style={{ fontFamily: 'Sora_400Regular' }}
            >
              Nenhuma movimentação ainda.
            </Text>
          </View>
        )}
        {!showSkeleton &&
          !showEmpty &&
          transactions.map((t, i) => (
            <TransactionRow key={t.id} transaction={t} isFirst={i === 0} />
          ))}
      </Card>
    </View>
  );
}
