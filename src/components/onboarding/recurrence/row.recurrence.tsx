import { IRecurrentsTRow } from '@/database/tables/recurrents.table';
import { formatCurrency } from '@/libs/masks';
import { cn } from '@/libs/utils';
import { Text, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

function RightAction() {
  return (
    <>
      <TouchableOpacity className="w-32" onPress={() => {}}>
        <View className="mt-2.5 flex h-10 w-28 justify-center rounded-lg bg-blue-800 pl-4">
          <Text
            className="text-lg text-text-primary"
            style={{ fontFamily: 'Sora_400Regular' }}
          >
            Editar
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
}

export function RecurrencyRow({ item: row }: { item: IRecurrentsTRow }) {
  return (
    <Swipeable
      containerStyle={{
        overflow: 'visible',
        marginBottom: 16,
      }}
      renderLeftActions={() => <RightAction />}
    >
      <View className="flex h-20 w-full flex-row gap-4 rounded-lg ">
        <View className="mt-2.5 h-10 w-10 items-center justify-center rounded-lg border border-border-default bg-app-bg">
          <Text
            className="text-text-primary"
            style={{ fontFamily: 'Sora_400Regular' }}
          >
            {row.due_day}
          </Text>
        </View>
        <View className="flex flex-1 flex-col gap-2 border-b border-border-default">
          <Text
            className="text-lg text-text-primary"
            style={{ fontFamily: 'Sora_400Regular' }}
          >
            {row.category_name}
          </Text>
          <Text
            className={cn(
              'text-base',
              row.type === 'income' ? 'text-income' : 'text-outcome'
            )}
            style={{ fontFamily: 'Sora_400Regular' }}
          >
            {formatCurrency(row.base_value.toString())}
          </Text>
        </View>
      </View>
    </Swipeable>
  );
}
