import { cn } from '@/libs/utils';
import { Text, TextProps } from 'react-native';

interface LabelProps extends TextProps {
  label: string;
  uppercase?: boolean;
  weight?: 'regular' | 'semibold' | 'bold';
}
export function Label({
  label,
  className,
  uppercase = true,
  weight = 'regular',
}: LabelProps) {
  return (
    <Text
      className={cn(
        'text-base  font-normal  text-text/65',
        uppercase && 'uppercase',
        className
      )}
      style={
        weight === 'regular'
          ? { fontFamily: 'Sora_400Regular' }
          : weight === 'semibold'
            ? { fontFamily: 'Sora_600SemiBold' }
            : { fontFamily: 'Sora_700Bold' }
      }
    >
      {label}
    </Text>
  );
}
