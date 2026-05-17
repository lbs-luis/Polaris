import { Card } from '@/components/ui/card';
import { Money } from '@/components/ui/money';
import { IInvoicesTRow } from '@/database/tables/invoices.table';
import { Text, View } from 'react-native';

interface DetailInvoiceMetaProps {
  invoice: IInvoicesTRow;
}

function Row({
  label,
  value,
  isLast,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <View
      className={`px-4 py-3 ${isLast ? '' : 'border-b border-border-subtle'}`}
    >
      <Text
        className="text-xs text-text-mute"
        style={{ fontFamily: 'Sora_600SemiBold' }}
      >
        {label}
      </Text>
      <Text
        className="mt-1 text-sm text-text"
        style={{ fontFamily: 'Sora_400Regular' }}
      >
        {value}
      </Text>
    </View>
  );
}

export function DetailInvoiceMeta({ invoice }: DetailInvoiceMetaProps) {
  const numberSeries = [invoice.number, invoice.series]
    .filter(Boolean)
    .join(' / ');

  return (
    <View>
      <Text
        className="mb-2 px-1 text-xs text-text-mute"
        style={{ fontFamily: 'Sora_700Bold' }}
      >
        ESTABELECIMENTO
      </Text>
      <Card className="p-0">
        <Row label="Nome" value={invoice.merchant} />
        <Row label="CNPJ" value={invoice.cnpj} />
        {invoice.address ? (
          <Row label="Endereço" value={invoice.address} />
        ) : null}
        {numberSeries ? <Row label="Nº / Série" value={numberSeries} /> : null}
        {invoice.payment_method ? (
          <Row label="Pagamento" value={invoice.payment_method} />
        ) : null}
        {invoice.paid !== null ? (
          <View className="flex-row items-center justify-between px-4 py-3">
            <Text
              className="text-xs text-text-mute"
              style={{ fontFamily: 'Sora_600SemiBold' }}
            >
              Valor pago
            </Text>
            <Money
              value={invoice.paid / 100}
              className="text-sm text-text"
              bold
            />
          </View>
        ) : (
          <Row label="Valor pago" value="—" isLast />
        )}
      </Card>
    </View>
  );
}
