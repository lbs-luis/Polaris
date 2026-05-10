import { BottomSheetProvider } from '@/context/bottomsheet.context';
import { migrate } from '@/database/migrate';
import '@/styles/global.css';
import {
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_700Bold,
  useFonts,
} from '@expo-google-fonts/sora';
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
      <Suspense>
        <SQLiteProvider onInit={migrate} databaseName="polaris.db" useSuspense>
          <BottomSheetProvider>
            <SafeAreaView
              edges={['top', 'bottom']}
              style={{ flex: 1 }}
              className="bg-app-bg"
            >
              <Slot />
            </SafeAreaView>
          </BottomSheetProvider>
        </SQLiteProvider>
      </Suspense>
    </GestureHandlerRootView>
  );
}
