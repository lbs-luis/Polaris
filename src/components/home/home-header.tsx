import { useSettingsTable } from '@/database/tables/settings.table';
import { BellIcon } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

export function HomeHeader() {
  const { select } = useSettingsTable();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([select('name'), select('avatar')]).then(
      ([nameRow, avatarRow]) => {
        if (nameRow) setName(nameRow.sValue);
        if (avatarRow) setAvatar(avatarRow.sValue);
      }
    );
  }, [select]);

  const initial = name?.[0]?.toUpperCase() ?? '?';
  const firstName = name?.split(' ')[0] ?? '';

  return (
    <View className="flex-row items-center justify-between px-5 pt-2">
      <View className="flex-row items-center gap-2.5">
        <View className="h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border-subtle bg-surface-2">
          {avatar ? (
            <Image
              source={{ uri: avatar }}
              style={{ width: 40, height: 40 }}
              resizeMode="cover"
            />
          ) : (
            <Text
              className="text-base text-text"
              style={{ fontFamily: 'Sora_700Bold' }}
            >
              {initial}
            </Text>
          )}
        </View>
        <View>
          <Text
            className="text-xs text-text-dim"
            style={{ fontFamily: 'Sora_400Regular' }}
          >
            Olá,
          </Text>
          <Text
            className="text-base text-text"
            style={{ fontFamily: 'Sora_700Bold' }}
          >
            {firstName || 'Bem-vindo'}
          </Text>
        </View>
      </View>
      <Pressable className="relative h-11 w-11 items-center justify-center rounded-full bg-surface">
        <BellIcon size={20} color="#FFFFFF" weight="regular" />
        <View
          className="absolute h-2 w-2 rounded-full bg-white"
          style={{
            top: 10,
            right: 12,
            borderWidth: 2,
            borderColor: '#0E0E10',
          }}
        />
      </Pressable>
    </View>
  );
}
