import { cn } from '@/libs/utils';
import { Text, View, ViewProps } from 'react-native';

interface StepHeaderProps extends ViewProps {
  title: string;
  description: string;
}

export function StepHeader({ description, title, className }: StepHeaderProps) {
  return (
    <View className={cn('mt-7 flex w-full flex-col', className)}>
      <Text
        className="text-3xl text-text-primary"
        style={{ fontFamily: 'Sora_700Bold' }}
      >
        {title}
      </Text>
      <Text
        className="mt-2 text-lg text-text-secondary"
        style={{ fontFamily: 'Sora_400Regular' }}
      >
        {description}
      </Text>
    </View>
  );
}
