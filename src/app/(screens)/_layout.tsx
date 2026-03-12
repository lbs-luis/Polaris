import '@/styles/global.css';
import { Slot } from 'expo-router';
import { View } from 'react-native';

export default function AppLayout() {
  return (
    <View className="bg-background flex h-dvh w-screen flex-col">
      <Slot />
    </View>
  );
}
