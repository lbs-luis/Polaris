import { PencilSimpleIcon } from 'phosphor-react-native';
import { Image, Pressable, Text, View } from 'react-native';

interface ProfileAvatarBlockProps {
  avatar: string | null;
  initial: string;
  onPress: () => void;
}

const SIZE = 112;

export function ProfileAvatarBlock({
  avatar,
  initial,
  onPress,
}: ProfileAvatarBlockProps) {
  return (
    <Pressable onPress={onPress} className="items-center pb-4 pt-6">
      <View
        className="items-center justify-center overflow-hidden rounded-full border border-border-subtle bg-surface-2"
        style={{ width: SIZE, height: SIZE, borderRadius: SIZE / 2 }}
      >
        {avatar ? (
          <Image
            source={{ uri: avatar }}
            style={{ width: SIZE, height: SIZE }}
            resizeMode="cover"
          />
        ) : (
          <Text
            className="text-3xl text-text"
            style={{ fontFamily: 'Sora_700Bold' }}
          >
            {initial}
          </Text>
        )}
      </View>
      <View
        className="absolute h-7 w-7 items-center justify-center rounded-full border border-bg bg-brand"
        style={{ bottom: 10, right: '38%' }}
      >
        <PencilSimpleIcon size={14} color="#000000" weight="bold" />
      </View>
    </Pressable>
  );
}
