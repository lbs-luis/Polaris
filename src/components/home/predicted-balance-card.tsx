import { AccountChip } from '@/components/home/account-chip';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Money } from '@/components/ui/money';
import { Pill } from '@/components/ui/pill';
import { IBankAccountTRow } from '@/database/tables/bank-accounts.table';
import { PlusIcon, WalletIcon } from 'phosphor-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

interface PredictedBalanceCardProps {
  total: number;
  accounts: IBankAccountTRow[];
  onAddAccount: () => void;
  onEditAccount: (account: IBankAccountTRow) => void;
}

export function PredictedBalanceCard({
  total,
  accounts,
  onAddAccount,
  onEditAccount,
}: PredictedBalanceCardProps) {
  return (
    <Card className="p-5">
      <View className="flex-row items-start justify-between">
        <Label label="Saldo previsto" uppercase={false} />
        <Pill tone="neutral">
          <View className="flex-row items-center gap-1.5">
            <WalletIcon size={12} color="#FFFFFF" weight="regular" />
            <Text
              className="text-[11px] text-text"
              style={{ fontFamily: 'Sora_700Bold' }}
            >
              {accounts.length} {accounts.length === 1 ? 'conta' : 'contas'}
            </Text>
          </View>
        </Pill>
      </View>

      <View className="mt-1.5">
        <Money value={total} className="text-4xl text-text" bold />
      </View>
      <Text
        className="mt-0.5 text-xs text-text-dim"
        style={{ fontFamily: 'Sora_400Regular' }}
      >
        Soma de todas as contas conectadas
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingTop: 4, paddingBottom: 4 }}
        style={{ marginHorizontal: -20, marginTop: 14, paddingHorizontal: 20 }}
      >
        {accounts.map((a) => (
          <AccountChip
            key={a.id}
            account={a}
            onPress={() => onEditAccount(a)}
          />
        ))}
        <Pressable onPress={onAddAccount}>
          <View
            className="flex-row items-center justify-center gap-2 rounded-tile border border-dashed border-border bg-transparent px-3 py-2.5"
            style={{ minWidth: 140, height: 64 }}
          >
            <PlusIcon size={14} color="#9A9AA2" weight="bold" />
            <Text
              className="text-xs text-text-dim"
              style={{ fontFamily: 'Sora_700Bold' }}
            >
              Adicionar
            </Text>
          </View>
        </Pressable>
      </ScrollView>
    </Card>
  );
}
