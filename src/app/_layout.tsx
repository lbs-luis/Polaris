import { BottomSheetProvider } from '@/context/bottomsheet.context';
import { InvoiceProcessorProvider } from '@/context/invoice-processor.context';
import { migrate } from '@/database/migrate';
import { useRecurrentsReconciler } from '@/hooks/use-recurrents-reconciler';
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

/**
 * Mounted inside the SQLiteProvider so the hook can read/write the DB.
 * Runs the recurrents-to-transactions reconciliation at most once per day.
 */
function RecurrentsReconciler() {
  useRecurrentsReconciler();
  return null;
}

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
              <RecurrentsReconciler />
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
