import '../../global.css';

import { DatabaseProvider } from '@/contexts/DatabaseProvider';
import { Slot } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex h-screen w-screen flex-col bg-red-500">
        <DatabaseProvider>
          <Slot />
        </DatabaseProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
