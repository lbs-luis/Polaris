import { cn } from '@/libs/utils';
import { X } from 'lucide-react-native';
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
          ? 'border-accent-indigo-border bg-accent-indigo-surface pr-3'
          : 'border-border-default bg-surface-primary pr-5'
      )}
    >
      <Text
        className="text-base lowercase text-text-primary"
        style={{ fontFamily: 'Sora_400Regular' }}
      >
        {label}
      </Text>
      {!isDefault && (
        <TouchableWithoutFeedback onPress={onDelete}>
          <View className="flex items-center justify-center rounded-full bg-surface-primary p-1">
            <X size={10} color="#ffffff" />
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}
