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
import { KeyboardAvoidingView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

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
            <SafeAreaProvider className="flex-1">
              <SafeAreaView
                edges={['bottom', 'top']}
                className="bg-app-bg"
                style={{ flex: 1 }}
              >
                <KeyboardAvoidingView
                  enabled
                  behavior={'height'}
                  style={{ flex: 1 }}
                  keyboardVerticalOffset={10}
                >
                  <Slot />
                </KeyboardAvoidingView>
              </SafeAreaView>
            </SafeAreaProvider>
          </SQLiteProvider>
        </Suspense>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
