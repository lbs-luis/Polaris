import { useEffect, useState } from 'react';
import { Keyboard, PixelRatio } from 'react-native';

export function useKeyboardOffset() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height / PixelRatio.get());
    });

    const hide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return keyboardHeight;
}
