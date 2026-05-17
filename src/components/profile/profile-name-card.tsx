import { Card } from '@/components/ui/card';
import { CaretRightIcon } from 'phosphor-react-native';
import { Pressable, Text, View } from 'react-native';

interface ProfileNameCardProps {
  name: string;
  onPress: () => void;
}

export function ProfileNameCard({ name, onPress }: ProfileNameCardProps) {
  return (
    <Card className="p-0">
      <Pressable
        onPress={onPress}
        className="flex-row items-center justify-between px-4 py-3.5"
      >
        <View className="flex-1">
          <Text
            className="text-xs text-text-mute"
            style={{ fontFamily: 'Sora_600SemiBold' }}
          >
            Nome
          </Text>
          <Text
            className="mt-1 text-base text-text"
            style={{ fontFamily: 'Sora_700Bold' }}
            numberOfLines={1}
          >
            {name || 'Adicionar nome'}
          </Text>
        </View>
        <CaretRightIcon size={16} color="#5E5E66" weight="bold" />
      </Pressable>
    </Card>
  );
}
