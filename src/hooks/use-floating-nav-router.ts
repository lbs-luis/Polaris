import { NavTab } from '@/components/layout/floating-bottom-nav';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

/**
 * Centralizes the `onTabPress` handler used by every screen that mounts the
 * `<FloatingBottomNav />`. Each tab maps to a real route so cross-tab
 * navigation works regardless of which screen the nav is currently rendered on.
 */
export function useFloatingNavRouter() {
  const router = useRouter();

  const onTabPress = useCallback(
    (tab: NavTab) => {
      switch (tab) {
        case 'home':
          router.push('/home');
          return;
        case 'tx':
          router.push('/transactions');
          return;
        case 'scan':
          router.push('/scan');
          return;
        case 'me':
          router.push('/profile');
          return;
      }
    },
    [router]
  );

  return { onTabPress };
}
