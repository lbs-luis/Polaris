import { cn } from '@/libs/utils';
import { XIcon } from 'phosphor-react-native';
import { Text, TouchableWithoutFeedback, View } from 'react-native';

interface CategoryBadgeProps {
  label: string;
  onDelete: () => Promise<void>;
  isDefault: boolean;
}
export function CategoryBadge({
  label,
  onDelete,
  isDefault,
}: CategoryBadgeProps) {
  return (
    <View
      className={cn(
        'flex flex-row items-center justify-center gap-3 self-start rounded-full border py-2 pl-5 ',
        !isDefault
          ? 'border-border bg-surface-2 pr-3'
          : 'border-border bg-surface pr-5'
      )}
    >
      <Text
        className="text-base lowercase text-text"
        style={{ fontFamily: 'Sora_400Regular' }}
      >
        {label}
      </Text>
      {!isDefault && (
        <TouchableWithoutFeedback onPress={onDelete}>
          <View className="flex items-center justify-center rounded-full bg-surface p-1">
            <XIcon size={10} color="#ffffff" weight="bold" />
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}
