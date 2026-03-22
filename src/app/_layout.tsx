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
        <SafeAreaProvider>
          <SafeAreaView className="bg-primary flex flex-1 flex-col">
            <Slot />
          </SafeAreaView>
        </SafeAreaProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
