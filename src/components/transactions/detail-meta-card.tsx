import { Card } from '@/components/ui/card';
import { ITransactionsTRow } from '@/database/tables/transactions.table';
import { formatInvoiceDateTime, formatRelativeDate } from '@/libs/dates';
import { ReactNode } from 'react';
import { Text, View } from 'react-native';

interface DetailMetaCardProps {
  transaction: ITransactionsTRow;
}

function MetaRow({
  label,
  value,
  isLast,
}: {
  label: string;
  value: ReactNode;
  isLast?: boolean;
}) {
  return (
    <View
      className={`flex-row items-center justify-between px-4 py-3 ${isLast ? '' : 'border-b border-border-subtle'}`}
    >
      <Text
        className="text-xs text-text-mute"
        style={{ fontFamily: 'Sora_600SemiBold' }}
      >
        {label}
      </Text>
      <View className="max-w-[60%]">
        {typeof value === 'string' || typeof value === 'number' ? (
          <Text
            numberOfLines={1}
            className="text-right text-sm text-text"
            style={{ fontFamily: 'Sora_700Bold' }}
          >
            {value}
          </Text>
        ) : (
          value
        )}
      </View>
    </View>
  );
}

function sourceLabel(t: ITransactionsTRow): string {
  if (t.invoice_id) return 'Nota fiscal';
  if (t.recurrent_id) return 'Recorrência';
  return 'Manual';
}

export function DetailMetaCard({ transaction }: DetailMetaCardProps) {
  const dateLabel = transaction.issued_at
    ? formatInvoiceDateTime(transaction.issued_at)
    : transaction.due_day
      ? formatRelativeDate(
          transaction.due_day,
          transaction.month,
          transaction.year
        )
      : `${transaction.month}/${transaction.year}`;

  return (
    <Card className="p-0">
      <MetaRow label="Data" value={dateLabel} />
      <MetaRow
        label="Categoria"
        value={transaction.category_name ?? 'Sem categoria'}
      />
      <MetaRow label="Origem" value={sourceLabel(transaction)} isLast />
    </Card>
  );
}
