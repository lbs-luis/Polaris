import { useKeyboardBehavior } from '@/hooks/keyboard/use-keyboard-behavior';
import { cn } from '@/libs/utils';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  ViewProps,
} from 'react-native';

interface KeyboardViewProps extends ViewProps {
  scroll?: boolean;
}

export function KeyboardView({
  children,
  className,
  scroll = true,
}: KeyboardViewProps) {
  const behavior = useKeyboardBehavior();

  return (
    <KeyboardAvoidingView
      behavior={behavior}
      className="flex-1"
      style={{ borderRadius: 90 }}
    >
      {scroll ? (
        <ScrollView
          style={{ borderRadius: 24 }}
          className="flex-1"
          contentContainerClassName={cn('flex flex-col', className)}
          contentContainerStyle={{ flexGrow: 1, borderRadius: 24 }}
          keyboardShouldPersistTaps="never"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View className={cn('flex flex-1 flex-col', className)}>
          {children}
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
