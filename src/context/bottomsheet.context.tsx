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
import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';

interface OpenSheetOptions {
  title?: string;
}

interface BottomSheetContextType {
  openBottomSheet: (
    content: React.ReactNode,
    options?: OpenSheetOptions
  ) => void;
  closeBottomSheet: () => void;
}

export const BottomSheetContext = createContext<BottomSheetContextType>(
  {} as BottomSheetContextType
);

export const BottomSheetProvider: FC<PropsWithChildren> = ({ children }) => {
  const [content, setContent] = useState<React.ReactNode | null>(null);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const openBottomSheet = useCallback(
    (newContent: React.ReactNode, options?: OpenSheetOptions) => {
      setContent(newContent);
      setTitle(options?.title);
      setIsOpen(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bottomSheetRef.current?.expand();
        });
      });
    },
    []
  );

  const closeBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
    setIsOpen(false);
    setContent(null);
    setTitle(undefined);
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      Keyboard.dismiss();
      setIsOpen(false);
      setContent(null);
      setTitle(undefined);
    }
  }, []);

  return (
    <BottomSheetContext.Provider value={{ openBottomSheet, closeBottomSheet }}>
      {children}

      {isOpen && (
        <TouchableWithoutFeedback onPress={closeBottomSheet}>
          <View className="z-1 absolute inset-0 bg-black/60" />
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
          backgroundColor: '#0E0E10',
          borderTopLeftRadius: 26,
          borderTopRightRadius: 26,
          elevation: 9,
        }}
        handleIndicatorStyle={{
          width: 44,
          height: 4,
          backgroundColor: '#26262A',
        }}
      >
        <BottomSheetScrollView>
          {title && (
            <View className="px-6 pb-3 pt-1">
              <Text
                className="text-[19px] text-text"
                style={{ fontFamily: 'Sora_700Bold', letterSpacing: -0.2 }}
              >
                {title}
              </Text>
            </View>
          )}
          {content}
        </BottomSheetScrollView>
      </BottomSheet>
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheetContext = () => {
  return useContext(BottomSheetContext);
};
