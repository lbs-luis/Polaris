import { migrate } from '@/database/migrate';
import '@/styles/global.css';
import { Slot } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { Suspense } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <Suspense>
      <SQLiteProvider onInit={migrate} databaseName="polaris.db" useSuspense>
        <SafeAreaProvider className="flex-1">
          <SafeAreaView
            edges={['bottom', 'top']}
            className="flex flex-1 flex-col bg-primary-bg"
          >
            <Slot />
          </SafeAreaView>
        </SafeAreaProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
