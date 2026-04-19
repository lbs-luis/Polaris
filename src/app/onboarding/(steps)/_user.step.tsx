import { StepConfirmButton } from '@/components/onboarding/step-confirm-button';
import { StepHeader } from '@/components/onboarding/step-header';
import { useSettingsTable } from '@/database/tables/settings.table';
import pickImage from '@/hooks/image/pick-image';
import saveImageToApp from '@/hooks/image/save-image-to-app';
import { IRenderStepProps } from '@/interfaces/onboarding.types';
import { cn } from '@/libs/utils';
import * as FileSystem from 'expo-file-system/legacy';
import { Pencil, User2 } from 'lucide-react-native';

import { useEffect, useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function UserStep({ onNextStep }: IRenderStepProps) {
  const { select, set } = useSettingsTable();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [name, setName] = useState('');

  async function handleNextStep() {
    await set({
      sKey: 'name',
      sValue: name,
    });
    onNextStep();
  }

  async function handlePickImage() {
    const result = await pickImage();

    if (!result || result.canceled) return;

    const uri = result.assets[0].uri;

    const current = await select('avatar');

    if (current) {
      const oldUri = current.sValue;
      await FileSystem.deleteAsync(oldUri);
    }

    const savedUri = await saveImageToApp(uri);

    set({
      sKey: 'avatar',
      sValue: savedUri,
    });
    setAvatar(savedUri);
  }

  useEffect(() => {
    async function handleLoadUserAvatar() {
      const [userAvatar, userName] = await Promise.all([
        select('avatar'),
        select('name'),
      ]);

      if (userAvatar) setAvatar(userAvatar.sValue);
      if (userName) setName(userName.sValue);
    }

    handleLoadUserAvatar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <StepHeader title="Perfil" description="Personalize sua experiência." />

      <TouchableOpacity
        onPress={handlePickImage}
        className="relative mx-auto mt-12 h-40 w-40 rounded-full border border-app-accent/30"
      >
        <View className="absolute bottom-0 right-0 z-20 h-12 w-12 items-center justify-center rounded-full border border-app-accent bg-surface-tertiary">
          <Pencil size={18} fill={'#a9c7ff'} color={'#353534'} />
        </View>
        {avatar ? (
          <Image
            className="z-10 h-40 w-40 rounded-full"
            source={{
              uri: avatar,
            }}
          />
        ) : (
          <View className="z-10 flex-1 items-center justify-center rounded-full bg-surface-secondary">
            <View className="opacity-30">
              <User2 size={42} strokeWidth={1} color="#a9c7ff" />
            </View>
          </View>
        )}
      </TouchableOpacity>

      <View className="mt-12 flex w-full flex-col gap-2">
        <Text className="text-lg font-normal text-text-primary">
          Nome ou Apelido
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          className={cn(
            'w-full rounded-lg bg-input-primary px-5 py-5 text-lg font-normal text-text-primary',
            'placeholder:text-app-accent/40'
          )}
          placeholder="Zero Two"
        />
      </View>
      <StepConfirmButton onNextStep={handleNextStep} />
    </>
  );
}
