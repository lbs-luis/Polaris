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
    group.netCents >= 0
      ? 'text-[13px] text-income'
      : 'text-[13px] text-text-dim';

  return (
    <View className="mb-5">
      <View className="flex-row items-baseline justify-between px-2.5 pb-2.5">
        <Text
          className="text-xs uppercase text-text-mute"
          style={{ fontFamily: 'Sora_700Bold', letterSpacing: 0.6 }}
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
