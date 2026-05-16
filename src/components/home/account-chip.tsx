import { Money } from '@/components/ui/money';
import { IBankAccountTRow } from '@/database/tables/bank-accounts.table';
import { Pressable, Text, View } from 'react-native';

interface AccountChipProps {
  account: IBankAccountTRow;
  onPress?: () => void;
}

const LIGHT_COLORS = new Set(['#FFFFFF']);

function badgeTextColor(color: string) {
  return LIGHT_COLORS.has(color.toUpperCase()) ? '#000000' : '#FFFFFF';
}

export function AccountChip({ account, onPress }: AccountChipProps) {
  return (
    <Pressable onPress={onPress}>
      <View
        className="flex-col gap-1.5 rounded-tile border border-border-subtle bg-surface-2 px-3 py-2.5"
        style={{ minWidth: 140 }}
      >
        <View className="flex-row items-center gap-2">
          <View
            className="h-[22px] w-[22px] items-center justify-center rounded-[7px]"
            style={{ backgroundColor: account.color }}
          >
            <Text
              style={{
                fontFamily: 'Sora_700Bold',
                fontSize: 11,
                color: badgeTextColor(account.color),
              }}
            >
              {account.name[0]?.toUpperCase() ?? '?'}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            className="flex-1 text-xs text-text"
            style={{ fontFamily: 'Sora_600SemiBold' }}
          >
            {account.name}
          </Text>
        </View>
        <Money value={account.amount / 100} className="text-sm" bold />
      </View>
    </Pressable>
  );
}
