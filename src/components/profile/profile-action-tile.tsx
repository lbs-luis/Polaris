import { Card } from '@/components/ui/card';
import { CaretRightIcon, Icon as PhosphorIcon } from 'phosphor-react-native';
import { Pressable, Text, View } from 'react-native';

interface ProfileActionTileProps {
  icon: PhosphorIcon;
  label: string;
  description?: string;
  onPress: () => void;
}

export function ProfileActionTile({
  icon: Icon,
  label,
  description,
  onPress,
}: ProfileActionTileProps) {
  return (
    <Card className="p-0">
      <Pressable
        onPress={onPress}
        className="flex-row items-center gap-3 px-4 py-3.5"
      >
        <View className="h-10 w-10 items-center justify-center rounded-tile bg-surface-2">
          <Icon size={20} color="#FFFFFF" weight="bold" />
        </View>
        <View className="flex-1">
          <Text
            className="text-sm text-text"
            style={{ fontFamily: 'Sora_700Bold' }}
          >
            {label}
          </Text>
          {description ? (
            <Text
              className="mt-0.5 text-xs text-text-dim"
              style={{ fontFamily: 'Sora_400Regular' }}
            >
              {description}
            </Text>
          ) : null}
        </View>
        <CaretRightIcon size={16} color="#5E5E66" weight="bold" />
      </Pressable>
    </Card>
  );
}
