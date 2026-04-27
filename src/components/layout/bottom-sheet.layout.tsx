import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useEffect, useRef } from 'react';

interface LayoutBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function LayoutBottomSheet({
  isOpen,
  onClose,
  children,
}: LayoutBottomSheetProps) {
  const ref = useRef<BottomSheet>(null);

  useEffect(() => {
    if (isOpen) {
      ref.current?.expand();
    } else {
      ref.current?.close();
    }
  }, [isOpen]);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      enableDynamicSizing
      enablePanDownToClose
      onClose={onClose}
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={{ backgroundColor: '#1c1b1b' }}
      handleIndicatorStyle={{ backgroundColor: '#353534', width: 80 }}
    >
      <BottomSheetView className="flex-1">{children}</BottomSheetView>
    </BottomSheet>
  );
}
