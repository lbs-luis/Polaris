import { cn } from '@/libs/utils';
import { Text, TextProps } from 'react-native';

interface StepLabelProps extends TextProps {
  label: string;
  uppercase?: boolean;
  weight?: 'regular' | 'semibold' | 'bold';
}
export function StepLabel({
  label,
  className,
  uppercase = true,
  weight = 'regular',
}: StepLabelProps) {
  return (
    <Text
      className={cn(
        'text-base  font-normal  text-text-primary/65',
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
