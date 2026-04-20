import { migrate } from '@/database/migrate';
import '@/styles/global.css';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Slot } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { Suspense } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Suspense>
          <SQLiteProvider
            onInit={migrate}
            databaseName="polaris.db"
            useSuspense
          >
            <SafeAreaProvider className="flex-1">
              <SafeAreaView
                edges={['bottom', 'top']}
                className="flex flex-1 flex-col bg-app-bg"
              >
                <Slot />
              </SafeAreaView>
            </SafeAreaProvider>
          </SQLiteProvider>
        </Suspense>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
