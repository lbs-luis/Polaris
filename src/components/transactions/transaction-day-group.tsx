import { Card } from '@/components/ui/card';
import { Money } from '@/components/ui/money';
import { ITransactionsTRow } from '@/database/tables/transactions.table';
import { Text, View } from 'react-native';
import { TransactionDayGroup as DayGroup } from '@/hooks/view-models/use-transactions-screen';
import { TransactionListRow } from './transaction-list-row';

interface TransactionDayGroupProps {
  group: DayGroup;
  onEdit: (t: ITransactionsTRow) => void;
  onDelete: (id: number) => void;
}

export function TransactionDayGroup({
  group,
  onEdit,
  onDelete,
}: TransactionDayGroupProps) {
  const net = group.netCents / 100;
  const netClass =
    group.netCents >= 0 ? 'text-xs text-income' : 'text-xs text-text-dim';

  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between px-1 pb-2">
        <Text
          className="text-sm text-text"
          style={{ fontFamily: 'Sora_700Bold' }}
        >
          {group.label}
        </Text>
        <Money value={net} sign className={netClass} />
      </View>
      <Card className="p-0">
        {group.rows.map((t, i) => (
          <TransactionListRow
            key={t.id}
            transaction={t}
            index={i}
            total={group.rows.length}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </Card>
    </View>
  );
}
