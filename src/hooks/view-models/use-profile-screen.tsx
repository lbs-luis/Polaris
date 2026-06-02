import { useSettingsTable } from '@/database/tables/settings.table';
import pickImage from '@/hooks/image/pick-image';
import saveImageToApp from '@/hooks/image/save-image-to-app';
import * as FileSystem from 'expo-file-system/legacy';
import { useCallback, useEffect, useState } from 'react';

/**
 * Loads + persists the user's profile (name, avatar) from the settings table.
 * The Profile screen reuses the same `pickImage` + `saveImageToApp` flow as
 * the onboarding profile step so the avatar storage stays consistent.
 */
export function useProfileScreen() {
  const { select, set } = useSettingsTable();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    setIsLoading(true);
    const [nameRow, avatarRow] = await Promise.all([
      select('name'),
      select('avatar'),
    ]);
    setName(nameRow?.sValue ?? '');
    setAvatar(avatarRow?.sValue ?? null);
    setIsLoading(false);
  }, [select]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const updateName = useCallback(
    async (next: string) => {
      const trimmed = next.trim();
      if (!trimmed) return;
      await set({ sKey: 'name', sValue: trimmed });
      setName(trimmed);
    },
    [set]
  );

  const pickAvatar = useCallback(async () => {
    const result = await pickImage();
    if (!result || result.canceled) return;
    const uri = result.assets[0].uri;
    const current = await select('avatar');
    if (current) {
      try {
        await FileSystem.deleteAsync(current.sValue);
      } catch {
        // Old file may already be gone — ignore.
      }
    }
    const savedUri = await saveImageToApp(uri);
    await set({ sKey: 'avatar', sValue: savedUri });
    setAvatar(savedUri);
  }, [select, set]);

  return {
    name,
    avatar,
    isLoading,
    updateName,
    pickAvatar,
    refreshProfile,
  };
}
