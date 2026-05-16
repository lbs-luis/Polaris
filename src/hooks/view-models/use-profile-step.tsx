import { useSettingsTable } from '@/database/tables/settings.table';
import pickImage from '@/hooks/image/pick-image';
import saveImageToApp from '@/hooks/image/save-image-to-app';
import * as FileSystem from 'expo-file-system/legacy';
import { useCallback, useEffect, useState } from 'react';

export function useProfileStep() {
  const { select, set } = useSettingsTable();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const [userAvatar, userName] = await Promise.all([
        select('avatar'),
        select('name'),
      ]);
      if (userAvatar) setAvatar(userAvatar.sValue);
      if (userName) setName(userName.sValue);
    })();
  }, [select]);

  const pickAvatar = useCallback(async () => {
    const result = await pickImage();
    if (!result || result.canceled) return;

    const uri = result.assets[0].uri;
    const current = await select('avatar');
    if (current) {
      await FileSystem.deleteAsync(current.sValue);
    }
    const savedUri = await saveImageToApp(uri);
    await set({ sKey: 'avatar', sValue: savedUri });
    setAvatar(savedUri);
  }, [select, set]);

  const save = useCallback(async () => {
    setIsSaving(true);
    await set({ sKey: 'name', sValue: name });
    setIsSaving(false);
  }, [name, set]);

  const canContinue = name.trim().length > 1 && !isSaving;

  return { name, setName, avatar, pickAvatar, isSaving, save, canContinue };
}
