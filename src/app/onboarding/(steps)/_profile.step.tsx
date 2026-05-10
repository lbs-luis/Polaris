import { DismissKeyboardView } from '@/components/layout/dismiss-keyboard-view.layout';

import { StepHeader } from '@/components/onboarding/step-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSettingsTable } from '@/database/tables/settings.table';
import pickImage from '@/hooks/image/pick-image';
import saveImageToApp from '@/hooks/image/save-image-to-app';
import { IRenderStepProps } from '@/interfaces/onboarding.types';
import * as FileSystem from 'expo-file-system/legacy';
import { Plus, User2 } from 'lucide-react-native';

import { useEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

export default function ProfileStep({ onNextStep }: IRenderStepProps) {
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
  }, [select]);

  return (
    <DismissKeyboardView className="px-6 pb-4">
      <StepHeader
        title={`Olá,\nseja bem-\nvindo.`}
        description={`Vamos personalizar \no app para você.`}
      />
      <TouchableOpacity
        onPress={handlePickImage}
        className="relative mx-auto mt-12 h-40 w-40 rounded-full border border-border-default"
      >
        <View className="absolute bottom-0 right-0 z-20 h-9 w-9 items-center justify-center rounded-full border-[2px] border-app-bg bg-accent-blue-text/90">
          <Plus size={14} color={'#ffffff'} />
        </View>
        {avatar ? (
          <Image
            className="z-10 h-40 w-40 rounded-full"
            source={{
              uri: avatar,
            }}
          />
        ) : (
          <View className="z-10 flex-1 items-center justify-center rounded-full bg-surface-primary">
            <View className="opacity-30">
              <User2 size={42} strokeWidth={1} color="#ffffff" />
            </View>
          </View>
        )}
      </TouchableOpacity>
      <View className="mb-6 mt-12 flex w-full flex-col gap-2">
        <Input
          label="Seu nome ou apelido"
          value={name}
          onChangeText={setName}
          placeholder="Como quer ser chamado?"
        />
      </View>
      <Button onPress={handleNextStep} className="mt-auto" text="Continuar" />
    </DismissKeyboardView>
  );
}
