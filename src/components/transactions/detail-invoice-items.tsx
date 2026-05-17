import { Card } from '@/components/ui/card';
import { Money } from '@/components/ui/money';
import { IInvoiceItem } from '@/database/tables/invoices.table';
import { Text, View } from 'react-native';

interface DetailInvoiceItemsProps {
  items: IInvoiceItem[];
  taxTotal: number; // cents
  total: number; // cents
}

function formatQty(qty: number): string {
  return Number.isInteger(qty) ? String(qty) : qty.toFixed(2).replace('.', ',');
}

function ItemRow({ item, isLast }: { item: IInvoiceItem; isLast?: boolean }) {
  return (
    <View
      className={`gap-1 px-4 py-3 ${isLast ? '' : 'border-b border-border-subtle'}`}
    >
      <View className="flex-row items-start justify-between gap-3">
        <Text
          className="flex-1 text-sm text-text"
          style={{ fontFamily: 'Sora_600SemiBold' }}
        >
          {item.desc}
        </Text>
        <Money
          value={item.total_value / 100}
          className="text-sm text-text"
          bold
        />
      </View>
      <Text
        className="text-xs text-text-mute"
        style={{ fontFamily: 'Sora_400Regular' }}
      >
        {formatQty(item.qty)} ×{' '}
        {(item.unit_value / 100).toFixed(2).replace('.', ',')}
        {item.code ? ` · cód. ${item.code}` : ''}
      </Text>
    </View>
  );
}

function SummaryRow({
  label,
  value,
  emphasis,
  hint,
  isLast,
}: {
  label: string;
  value: number; // cents
  emphasis?: boolean;
  hint?: string;
  isLast?: boolean;
}) {
  return (
    <View
      className={`px-4 py-3 ${isLast ? '' : 'border-b border-border-subtle'}`}
    >
      <View className="flex-row items-center justify-between">
        <Text
          className={emphasis ? 'text-sm text-text' : 'text-xs text-text-mute'}
          style={{
            fontFamily: emphasis ? 'Sora_700Bold' : 'Sora_600SemiBold',
          }}
        >
          {label}
        </Text>
        <Money
          value={value / 100}
          className={emphasis ? 'text-base text-text' : 'text-sm text-text'}
          bold={emphasis}
        />
      </View>
      {hint ? (
        <Text
          className="mt-1 text-[11px] text-text-mute"
          style={{ fontFamily: 'Sora_400Regular' }}
        >
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

export function DetailInvoiceItems({
  items,
  taxTotal,
  total,
}: DetailInvoiceItemsProps) {
  const subtotal = items.reduce((sum, i) => sum + i.total_value, 0);

  return (
    <View className="mt-4">
      <Text
        className="mb-2 px-1 text-xs text-text-mute"
        style={{ fontFamily: 'Sora_700Bold' }}
      >
        ITENS ({items.length})
      </Text>
      <Card className="p-0">
        {items.map((item, i) => (
          <ItemRow
            key={`${item.code}-${i}`}
            item={item}
            isLast={i === items.length - 1}
          />
        ))}
      </Card>

      <View className="mt-3">
        <Card className="p-0">
          <SummaryRow label="Subtotal" value={subtotal} />
          <SummaryRow
            label="Tributos"
            value={taxTotal}
            hint="Lei Federal 12.741/2012"
          />
          <SummaryRow label="Total" value={total} emphasis isLast />
        </Card>
      </View>
    </View>
  );
}
