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
import { SafeAreaView } from 'react-native-safe-area-context';

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
            <SafeAreaView
              edges={['top', 'bottom']}
              style={{ flex: 1 }}
              className="bg-app-bg"
            >
              <Slot />
            </SafeAreaView>
          </SQLiteProvider>
        </Suspense>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
