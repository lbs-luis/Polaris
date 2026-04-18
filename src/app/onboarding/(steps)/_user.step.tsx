import { useSettingsTable } from '@/database/tables/settings.table';
import pickImage from '@/hooks/image/pick-image';
import saveImageToApp from '@/hooks/image/save-image-to-app';
import { IRenderStepProps } from '@/interfaces/onboarding.types';
import * as FileSystem from 'expo-file-system/legacy';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Images } from 'lucide-react-native';
import { useState } from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { twMerge } from 'tailwind-merge';

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

  return (
    <>
      <Text className="mt-6 text-3xl font-semibold text-primary-text">
        Qual seu nome?
      </Text>

      <TextInput
        value={name}
        onChangeText={setName}
        className={twMerge(
          'mt-4 h-20 w-full rounded-3xl bg-secondary-bg px-6 py-5 text-2xl font-normal text-primary-text',
          'placeholder:text-primary-text/50'
        )}
        placeholder="ex: Zero Two"
      />

      <View className="mt-10 flex w-full flex-row gap-4">
        <TouchableWithoutFeedback onPress={handlePickImage}>
          <View
            className={twMerge(
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
      <TouchableOpacity
        className="mt-auto w-full overflow-hidden rounded-3xl"
        onPress={handleNextStep}
      >
        <LinearGradient
          colors={['#3D5AFE', '#37438B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="flex flex-row items-center justify-center gap-2  py-6"
        >
          <Text className="text-xl font-semibold text-white">Continuar</Text>
          <ArrowRight color="#ffffff" size={24} />
        </LinearGradient>
      </TouchableOpacity>
    </>
  );
}
