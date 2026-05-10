import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';

interface BottomSheetContextType {
  openBottomSheet: (content: React.ReactNode) => void;
  closeBottomSheet: () => void;
}

export const BottomSheetContext = createContext<BottomSheetContextType>(
  {} as BottomSheetContextType
);

export const BottomSheetProvider: FC<PropsWithChildren> = ({ children }) => {
  const [content, setContent] = useState<React.ReactNode | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const openBottomSheet = useCallback((newContent: React.ReactNode) => {
    setContent(newContent);
    setIsOpen(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bottomSheetRef.current?.expand();
      });
    });
  }, []);

  const closeBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
    setIsOpen(false);
    setContent(null);
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      Keyboard.dismiss();
      setIsOpen(false);
      setContent(null);
    }
  }, []);

  return (
    <BottomSheetContext.Provider
      value={{
        openBottomSheet,
        closeBottomSheet,
      }}
    >
      {children}

      {isOpen && (
        <TouchableWithoutFeedback onPress={closeBottomSheet}>
          <View className="z-1 absolute inset-0 bg-black/50" />
        </TouchableWithoutFeedback>
      )}

      <BottomSheet
        index={-1}
        ref={bottomSheetRef}
        enableDynamicSizing
        style={{ zIndex: 2 }}
        enablePanDownToClose
        onChange={handleSheetChanges}
        backgroundStyle={{
          backgroundColor: '#18181b',
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          elevation: 9,
        }}
        handleIndicatorStyle={{ width: 80, backgroundColor: '#3a3a3d' }}
      >
        <BottomSheetScrollView>{content}</BottomSheetScrollView>
      </BottomSheet>
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheetContext = () => {
  return useContext(BottomSheetContext);
};
