import { Card } from '@/components/ui/card';
import { TransactionRow } from '@/components/ui/transaction-row';
import { ITransactionsTRow } from '@/database/tables/transactions.table';
import { PlusIcon } from 'phosphor-react-native';
import { Pressable, Text, View } from 'react-native';
import { TransactionRowSkeleton } from './transaction-row-skeleton';

interface RecentTransactionsCardProps {
  transactions: ITransactionsTRow[];
  isLoading?: boolean;
  onSeeAll?: () => void;
  /**
   * When provided, renders a white `+ Nova` pill in the section header so the
   * user can create a manual transaction without leaving home. The button
   * lives next to "Ver tudo" so the affordance sits beside the content it
   * creates instead of cluttering the page header.
   */
  onNew?: () => void;
}

const SKELETON_COUNT = 4;

export function RecentTransactionsCard({
  transactions,
  isLoading,
  onSeeAll,
  onNew,
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
        <View className="flex-row items-center gap-2">
          {onNew ? (
            <Pressable
              onPress={onNew}
              className="flex-row items-center gap-1.5 rounded-full bg-white px-3 py-1.5"
              style={{
                shadowColor: '#FFFFFF',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.14,
                shadowRadius: 14,
                elevation: 2,
              }}
            >
              <PlusIcon size={12} color="#000000" weight="bold" />
              <Text
                className="text-xs text-bg"
                style={{ fontFamily: 'Sora_700Bold' }}
              >
                Nova
              </Text>
            </Pressable>
          ) : null}
          <Pressable
            onPress={onSeeAll}
            className="rounded-full border border-border-subtle px-3 py-1.5"
          >
            <Text
              className="text-xs text-text"
              style={{ fontFamily: 'Sora_700Bold' }}
            >
              Ver tudo
            </Text>
          </Pressable>
        </View>
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
