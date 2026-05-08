import { DismissKeyboardView } from '@/components/layout/dismiss-keyboard-view.layout';
import { migrate } from '@/database/migrate';
import '@/styles/global.css';
import {
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_700Bold,
  useFonts,
} from '@expo-google-fonts/sora';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Slot } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { Suspense } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const [,] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_700Bold,
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Suspense>
          <SQLiteProvider
            onInit={migrate}
            databaseName="polaris.db"
            useSuspense
          >
            <DismissKeyboardView>
              <Slot />
            </DismissKeyboardView>
          </SQLiteProvider>
        </Suspense>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
