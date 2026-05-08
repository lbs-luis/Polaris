import { useKeyboardBehavior } from '@/hooks/keyboard/use-keyboard-behavior';
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  ViewProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export function DismissKeyboardView({ children }: ViewProps) {
  const behavior = useKeyboardBehavior();

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={{ flex: 1 }}
      className="bg-app-bg"
    >
      <TouchableWithoutFeedback className="flex-1" onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior={behavior} className="flex-1">
          <ScrollView
            className="flex flex-1 flex-col"
            contentContainerStyle={{ flexGrow: 1 }}
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
