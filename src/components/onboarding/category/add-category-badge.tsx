import { Plus } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

export function AddCategoryBadge({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        className={
          'flex flex-row items-center justify-center gap-3 self-start rounded-full border border-accent-blue-border bg-accent-blue-surface  py-2 pl-4  pr-5'
        }
      >
        <Plus color={'#60a5fa'} size={10} />
        <Text
          className="text-base text-[#60a5fa]"
          style={{ fontFamily: 'Sora_400Regular' }}
        >
          adicionar
        </Text>
      </View>
    </TouchableOpacity>
  );
}
