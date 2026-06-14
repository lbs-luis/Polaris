import { theme } from '@/libs/theme';
import { Icon as PhosphorIcon } from 'phosphor-react-native';
import { Pressable, View } from 'react-native';

interface IconButtonProps {
  icon: PhosphorIcon;
  onPress?: () => void;
  /** Shows a small white dot in the top-right corner. */
  badge?: boolean;
  size?: number;
  color?: string;
}

/**
 * Circular, transparent icon button for header action rows (e.g. the camera on
 * Início). 44×44 touch target, One UI style.
 */
export function IconButton({
  icon: Icon,
  onPress,
  badge,
  size = 23,
  color = theme.text,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      className="relative h-11 w-11 items-center justify-center rounded-full"
    >
      <Icon size={size} color={color} weight="regular" />
      {badge ? (
        <View
          className="absolute h-2 w-2 rounded-full bg-white"
          style={{ top: 9, right: 11, borderWidth: 2, borderColor: theme.bg }}
        />
      ) : null}
    </Pressable>
  );
}
