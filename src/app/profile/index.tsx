import { FloatingBottomNav } from '@/components/layout/floating-bottom-nav';
import { NavHeader } from '@/components/layout/nav-header';
import { EditNameForm } from '@/components/profile/edit-name-form';
import { ProfileActionTile } from '@/components/profile/profile-action-tile';
import { ProfileAvatarBlock } from '@/components/profile/profile-avatar-block';
import { ProfileNameCard } from '@/components/profile/profile-name-card';
import { useBottomSheetContext } from '@/context/bottomsheet.context';
import { useFloatingNavRouter } from '@/hooks/use-floating-nav-router';
import { useProfileScreen } from '@/hooks/view-models/use-profile-screen';
import { useRouter } from 'expo-router';
import { ArrowsClockwiseIcon } from 'phosphor-react-native';
import { ScrollView, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { onTabPress } = useFloatingNavRouter();
  const { openBottomSheet, closeBottomSheet } = useBottomSheetContext();
  const { name, avatar, updateName, pickAvatar } = useProfileScreen();

  const initial = name?.[0]?.toUpperCase() ?? '?';

  function openEditNameSheet() {
    openBottomSheet(
      <EditNameForm
        initial={name}
        onSave={updateName}
        onClose={closeBottomSheet}
      />,
      { title: 'Editar nome' }
    );
  }

  return (
    <View className="flex-1 bg-bg pt-2">
      <NavHeader title="Perfil" description="Sua identidade e recorrências" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 110,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ProfileAvatarBlock
          avatar={avatar}
          initial={initial}
          onPress={pickAvatar}
        />

        <View className="mt-7  gap-3">
          <ProfileNameCard name={name} onPress={openEditNameSheet} />
          <ProfileActionTile
            icon={ArrowsClockwiseIcon}
            label="Recorrências"
            description="Entradas e saídas mensais automáticas"
            onPress={() => router.push('/recurrence')}
          />
        </View>
      </ScrollView>

      <FloatingBottomNav active="me" onTabPress={onTabPress} />
    </View>
  );
}
