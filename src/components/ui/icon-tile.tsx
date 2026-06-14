import { theme } from '@/libs/theme';
import { Icon as PhosphorIcon, IconWeight } from 'phosphor-react-native';
import { View } from 'react-native';

interface IconTileProps {
  icon: PhosphorIcon;
  size?: number;
  color?: string;
  bg?: string;
  weight?: IconWeight;
}

/**
 * Generic rounded-square icon tile — the non-category leading element used in
 * preference rows, the recurrence form, etc. Mirrors CatIcon's footprint so
 * lists stay aligned whether a row leads with a category or a plain icon.
 */
export function IconTile({
  icon: Icon,
  size = 44,
  color = theme.text,
  bg = theme.surface2,
  weight = 'regular',
}: IconTileProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.32,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon size={size * 0.5} color={color} weight={weight} />
    </View>
  );
}
