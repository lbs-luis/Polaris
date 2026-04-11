import { useSettingsTable } from '@/database/tables/settings.table';
import pickImage from '@/hooks/image/pick-image';
import saveImageToApp from '@/hooks/image/save-image-to-app';
import * as FileSystem from 'expo-file-system/legacy';
import { Images } from 'lucide-react-native';
import { useState } from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { twMerge } from 'tailwind-merge';

export default function UserStep() {
  const { insert, selectWhere, update } = useSettingsTable();
  const [avatar, setAvatar] = useState<string | null>(null);

  async function handlePickImage() {
    const result = await pickImage();

    if (!result || result.canceled) return;

    const uri = result.assets[0].uri;

    const current = await selectWhere('avatar');

    if (current.length > 0) {
      const oldUri = current[0].sValue;
      await FileSystem.deleteAsync(oldUri);
    }

    const savedUri = await saveImageToApp(uri);

    if (current.length > 0) {
      await update({
        sKey: 'avatar',
        sValue: savedUri,
      });
    } else {
      await insert({
        sKey: 'avatar',
        sValue: savedUri,
      });
    }

    setAvatar(savedUri);
  }

  return (
    <>
      <Text className="mt-6 text-3xl font-semibold text-primary-text">
        Qual seu nome?
      </Text>

      <TextInput
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
        {/* <TouchableWithoutFeedback onPress={() => setImageOption('url')}>
          <View
            className={twMerge(
              'flex w-[48%] select-none flex-col rounded-3xl border bg-secondary-bg p-5',
              imageOption === 'url' ? 'border-white' : 'border-secondary-bg'
            )}
          >
            <View className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-bg-foreground">
              <Link2 size={20} color={'#BBC3FF'} className="shrink-0" />
            </View>
            <Text className="mt-4 text-2xl font-normal text-primary-text">
              URL
            </Text>
            <Text className=" mt-1 text-base font-normal text-secondary-text">
              Link externo
            </Text>
          </View>
        </TouchableWithoutFeedback> */}
        <Image
          className="aspect-square w-[48%] rounded-3xl bg-white"
          source={{
            uri: avatar ?? 'https://picsum.photos/128',
          }}
        />
      </View>
    </>
  );
}
