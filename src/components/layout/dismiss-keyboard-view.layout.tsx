import { useKeyboardBehavior } from '@/hooks/keyboard/use-keyboard-behavior';
import { cn } from '@/libs/utils';
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  View,
  ViewProps,
} from 'react-native';

interface DismissKeyboardViewProps extends ViewProps {
  scroll?: boolean;
}

export function DismissKeyboardView({
  children,
  className,
  scroll = true,
}: DismissKeyboardViewProps) {
  const behavior = useKeyboardBehavior();

  return (
    <KeyboardAvoidingView behavior={behavior} className="flex-1">
      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName={cn('flex flex-col', className)}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="never"
        >
          {children}
        </ScrollView>
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className={cn('flex flex-1 flex-col', className)}>
            {children}
          </View>
        </TouchableWithoutFeedback>
      )}
    </KeyboardAvoidingView>
  );
}
