import { Avatar } from '@/components/ui/avatar';
import { useSettingsTable } from '@/database/tables/settings.table';
import { formatDayWithWeekday } from '@/libs/dates';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

/** Small profile-button-style header: avatar, greeting, and today's date. */
export function HomeGreeting() {
  const router = useRouter();
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

  const firstName = name.split(' ')[0];
  const today = formatDayWithWeekday(new Date());

  return (
    <Pressable
      onPress={() => router.push('/profile')}
      className="mt-2 flex-row items-center gap-3 px-6 py-2"
    >
      <Avatar name={name} photo={avatar} size={40} />
      <View>
        <Text
          className="text-[15px] text-text"
          style={{ fontFamily: 'Sora_700Bold' }}
        >
          {firstName ? `Bem-vindo, ${firstName}` : 'Bem-vindo'}
        </Text>
        <Text
          className="text-xs text-text-dim"
          style={{ fontFamily: 'Sora_400Regular' }}
        >
          {today}
        </Text>
      </View>
    </Pressable>
  );
}
