import { theme } from '@/libs/theme';
import { cn } from '@/libs/utils';
import { Icon as PhosphorIcon } from 'phosphor-react-native';
import { Pressable, ScrollView, Text } from 'react-native';

export interface FilterChip<T extends string> {
  id: T;
  label: string;
  icon?: PhosphorIcon;
}

interface FilterChipsProps<T extends string> {
  chips: FilterChip<T>[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
}

/**
 * FilterChips — a horizontally-scrolling row of pills used to filter a list.
 * The active chip fills white (brand); the rest sit on the card surface.
 */
export function FilterChips<T extends string>({
  chips,
  value,
  onChange,
  className,
}: FilterChipsProps<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
      className={cn('grow-0', className)}
    >
      {chips.map((c) => {
        const on = value === c.id;
        const Icon = c.icon;
        return (
          <Pressable
            key={c.id}
            onPress={() => onChange(c.id)}
            className={cn(
              'h-10 flex-row items-center gap-1.5 rounded-full px-4',
              on ? 'bg-brand' : 'bg-surface'
            )}
          >
            {Icon ? (
              <Icon
                size={15}
                color={on ? theme.brandFg : theme.text}
                weight="bold"
              />
            ) : null}
            <Text
              className={cn(
                'text-[13.5px]',
                on ? 'text-text-inverse' : 'text-text'
              )}
              style={{ fontFamily: 'Sora_700Bold' }}
            >
              {c.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
