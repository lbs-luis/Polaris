import { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingViewProps, Platform } from 'react-native';

export function useKeyboardBehavior() {
  const [behavior, setBehavior] =
    useState<KeyboardAvoidingViewProps['behavior']>('padding');

  useEffect(() => {
    if (Platform.OS === 'android') {
      const show = Keyboard.addListener('keyboardDidShow', () =>
        setBehavior('padding')
      );
      const hide = Keyboard.addListener('keyboardDidHide', () =>
        setBehavior(undefined)
      );
      return () => {
        show.remove();
        hide.remove();
      };
    }
  }, []);

  return behavior;
}
