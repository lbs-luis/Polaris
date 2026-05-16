import { PlusIcon } from 'phosphor-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

export function AddCategoryBadge({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex flex-row items-center justify-center gap-2 self-start rounded-full border border-dashed border-border bg-surface-2 py-2 pl-3 pr-4">
        <PlusIcon color="#FFFFFF" size={14} weight="bold" />
        <Text
          className="text-base text-text"
          style={{ fontFamily: 'Sora_400Regular' }}
        >
          adicionar
        </Text>
      </View>
    </TouchableOpacity>
  );
}
