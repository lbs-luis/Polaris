import { BottomSheetProvider } from '@/context/bottomsheet.context';
import { InvoiceProcessorProvider } from '@/context/invoice-processor.context';
import { migrate } from '@/database/migrate';
import '@/styles/global.css';
import {
  JetBrainsMono_500Medium,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';
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
  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_700Bold,
    JetBrainsMono_500Medium,
    JetBrainsMono_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Suspense>
        <SQLiteProvider onInit={migrate} databaseName="polaris.db" useSuspense>
          <InvoiceProcessorProvider>
            <BottomSheetProvider>
              <SafeAreaView
                edges={['top', 'bottom']}
                style={{ flex: 1 }}
                className="bg-bg"
              >
                <Slot />
              </SafeAreaView>
            </BottomSheetProvider>
          </InvoiceProcessorProvider>
        </SQLiteProvider>
      </Suspense>
    </GestureHandlerRootView>
  );
}
