import { cn } from '@/libs/utils';
import { Text, TextProps } from 'react-native';

export function StepHeader({ children, className, ...props }: TextProps) {
  return (
    <Text
      className={cn('mt-0 text-3xl font-semibold text-primary-text', className)}
      {...props}
    >
      {children}
    </Text>
  );
}
