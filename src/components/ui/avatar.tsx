import { Image, Text, View } from 'react-native';

interface AvatarProps {
  name?: string;
  photo?: string | null;
  size?: number;
}

/**
 * Round avatar: the user's photo when set, otherwise their initial on a
 * neutral surface tone. Used in the profile identity row and the edit sheet.
 */
export function Avatar({ name, photo, size = 56 }: AvatarProps) {
  const initial = name?.[0]?.toUpperCase() ?? '?';
  return (
    <View
      className="items-center justify-center overflow-hidden rounded-full bg-surface-2"
      style={{ width: size, height: size }}
    >
      {photo ? (
        <Image
          source={{ uri: photo }}
          style={{ width: size, height: size }}
          resizeMode="cover"
        />
      ) : (
        <Text
          className="text-text"
          style={{ fontFamily: 'Sora_700Bold', fontSize: size * 0.4 }}
        >
          {initial}
        </Text>
      )}
    </View>
  );
}
