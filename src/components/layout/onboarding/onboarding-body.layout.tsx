import { cn } from '@/libs/utils';
import { View, ViewProps } from 'react-native';

export function OnboardingBody({ children, className, ...props }: ViewProps) {
  return (
    <View {...props} className={cn('flex flex-1 flex-col px-6', className)}>
      {children}
    </View>
  );
}
