import { theme } from '@/libs/theme';
import { cn } from '@/libs/utils';
import { CaretRightIcon } from 'phosphor-react-native';
import { Pressable, Text, View } from 'react-native';

interface MetaRowProps {
  label: string;
  value: string;
  /** Renders the value in the brand color with a chevron, as a tappable link. */
  link?: boolean;
  onPress?: () => void;
  divider?: boolean;
}

/** Label · value row for detail metadata, lives inside a ListGroup. */
export function MetaRow({
  label,
  value,
  link,
  onPress,
  divider,
}: MetaRowProps) {
  const Wrap = onPress ? Pressable : View;
  return (
    <Wrap onPress={onPress} className="bg-surface">
      {divider ? <View className="ml-[18px] h-px bg-border-subtle" /> : null}
      <View className="flex-row items-center gap-3 px-[18px] py-4">
        <Text
          className="flex-1 text-sm text-text-dim"
          style={{ fontFamily: 'Sora_400Regular' }}
        >
          {label}
        </Text>
        <Text
          className={cn(
            'text-right text-[14.5px]',
            link ? 'text-brand' : 'text-text'
          )}
          style={{ fontFamily: 'Sora_600SemiBold' }}
        >
          {value}
        </Text>
        {link ? (
          <CaretRightIcon size={15} color={theme.brand} weight="bold" />
        ) : null}
      </View>
    </Wrap>
  );
}
