import {
  ISettingsTSelect,
  useSettingsTable,
} from '@/database/tables/settings.table';
import { IRenderStepProps } from '@/interfaces/onboarding.types';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function CategoryStep({ onNextStep }: IRenderStepProps) {
  const { select } = useSettingsTable();

  const [name, setName] = useState<ISettingsTSelect>(null);
  const [avatar, setAvatar] = useState<ISettingsTSelect>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      const nameResult = await select('name');
      const avatarResult = await select('avatar');

      setName(nameResult);
      setAvatar(avatarResult);
    }

    load().then(() => setIsLoadingUserData(false));
  }, []);

  return (
    <>
      <View className="flex w-full flex-col gap-1">
        <Text className="text-3xl font-semibold text-primary-text">
          Personalize seus fluxos.
        </Text>
        <Text className="text-sm font-semibold text-secondary-text">
          Defina como você organiza seu dinheiro. Adicione categorias
          personalizadas para refletir seu estilo de vida.
        </Text>
      </View>

      <Text className="mt-6 text-3xl font-semibold text-red-500">
        {isLoadingUserData ? 'CARREGANDO' : 'FINALIZADO'}
      </Text>

      <Text className="mt-6 text-xl font-semibold text-secondary-text">
        {name?.sValue}
      </Text>

      <Image
        className="aspect-square w-[48%] rounded-3xl bg-white"
        source={{
          uri: avatar?.sValue,
        }}
      />
      <TouchableOpacity className="mt-auto w-full overflow-hidden rounded-3xl">
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
