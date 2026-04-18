import { StepConfirmButton } from '@/components/onboarding/step-confirm-button';
import { StepHeader } from '@/components/onboarding/step-header';
import { useSettingsTable } from '@/database/tables/settings.table';
import pickImage from '@/hooks/image/pick-image';
import saveImageToApp from '@/hooks/image/save-image-to-app';
import { IRenderStepProps } from '@/interfaces/onboarding.types';
import { cn } from '@/libs/utils';
import * as FileSystem from 'expo-file-system/legacy';
import { Images } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

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
      <StepHeader>Qual seu nome?</StepHeader>

      <TextInput
        value={name}
        onChangeText={setName}
        className={cn(
          'mt-4 h-20 w-full rounded-3xl bg-secondary-bg px-6 py-5 text-2xl font-normal text-primary-text',
          'placeholder:text-primary-text/50'
        )}
        placeholder="ex: Zero Two"
      />

      <View className="mt-10 flex w-full flex-row gap-4">
        <TouchableWithoutFeedback onPress={handlePickImage}>
          <View
            className={cn(
              'flex w-[48%] select-none flex-col rounded-3xl bg-secondary-bg p-5'
            )}
          >
            <View className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-bg-foreground">
              <Images size={20} color={'#BBC3FF'} className="shrink-0" />
            </View>
            <Text className="mt-4 text-2xl font-normal text-primary-text">
              Galeria
            </Text>
            <Text className="mt-1 text-base font-normal text-secondary-text">
              Escolha diretamente{'\n'}do aparelho
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <Image
          className="aspect-square w-[48%] rounded-3xl bg-white"
          source={{
            uri: avatar ?? 'https://picsum.photos/128',
          }}
        />
      </View>
      <StepConfirmButton onNextStep={handleNextStep} />
    </>
  );
}
