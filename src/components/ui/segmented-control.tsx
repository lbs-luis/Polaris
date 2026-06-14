import { cn } from '@/libs/utils';
import { Pressable, Text, View } from 'react-native';

export interface SegOption<T extends string> {
  id: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegOption<T>[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
}

/**
 * SegmentedControl — pill track with the active segment filled white (brand).
 * Used to flip between mutually-exclusive views (e.g. Entradas / Saídas).
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <View
      className={cn('flex-row gap-1 rounded-full bg-surface p-1', className)}
    >
      {options.map((o) => {
        const on = value === o.id;
        return (
          <Pressable
            key={o.id}
            onPress={() => onChange(o.id)}
            className={cn(
              'flex-1 items-center justify-center rounded-full py-2.5',
              on ? 'bg-brand' : 'bg-transparent'
            )}
          >
            <Text
              className={cn('text-sm', on ? 'text-text-inverse' : 'text-text')}
              style={{ fontFamily: 'Sora_700Bold' }}
            >
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
