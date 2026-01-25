import { useDatabaseContext } from '@/contexts/DatabaseProvider';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { Pressable, Text, View } from 'react-native';

export default function Index() {
  const { database, onboarding } = useDatabaseContext();
  const router = useRouter();

  const navigateToOnboarding = () => router.replace('/onboarding');

  useEffect(() => {
    async function onboadinRedirectCheck() {
      if (database.ready && !(await onboarding.status()))
        return navigateToOnboarding();
    }
    onboadinRedirectCheck();
  }, [database.ready]);

  const handleResetOnboarding = () => {
    onboarding.reset();
    navigateToOnboarding();
  };

  return (
    <View className="flex-1 items-center bg-purple-700 pt-4">
      <Pressable
        className="size-fit rounded-xl bg-white px-8 py-4 shadow-lg active:scale-95"
        onPress={handleResetOnboarding}
      >
        <Text className="text-lg font-semibold text-purple-700">
          Resetar Onboarding
        </Text>
      </Pressable>
    </View>
  );
}
