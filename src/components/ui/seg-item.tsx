import { cn } from '@/libs/utils';
import { Icon as PhosphorIcon } from 'phosphor-react-native';
import { Pressable, Text } from 'react-native';

type Tone = 'income' | 'outcome' | 'brand';

const TONE_COLORS: Record<Tone, string> = {
  income: '#3CC85F',
  outcome: '#FF4D4D',
  brand: '#FFFFFF',
};

interface SegItemProps {
  icon?: PhosphorIcon;
  label: string;
  tone?: Tone;
  active?: boolean;
  onPress?: () => void;
  className?: string;
}

export function SegItem({
  icon: Icon,
  label,
  tone = 'brand',
  active,
  onPress,
  className,
}: SegItemProps) {
  const color = TONE_COLORS[tone];
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'h-13 flex-1 flex-row items-center justify-center gap-2 rounded-tile border-[1.5px]',
        active ? 'bg-surface-2' : 'bg-transparent',
        className
      )}
      style={{
        height: 52,
        borderColor: active ? color : '#2A2A2E',
      }}
    >
      {Icon && (
        <Icon
          size={16}
          color={active ? color : '#9A9AA2'}
          weight={active ? 'bold' : 'regular'}
        />
      )}
      <Text
        style={{
          fontFamily: 'Sora_700Bold',
          fontSize: 14,
          color: active ? color : '#9A9AA2',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
