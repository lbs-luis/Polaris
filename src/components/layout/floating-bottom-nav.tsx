import {
  CameraIcon,
  HouseIcon,
  Icon as PhosphorIcon,
  ReceiptIcon,
  UserIcon,
} from 'phosphor-react-native';
import { Pressable, Text, View } from 'react-native';

export type NavTab = 'home' | 'tx' | 'scan' | 'me';

interface TabSpec {
  id: NavTab;
  label: string;
  icon: PhosphorIcon;
  fab?: boolean;
}

const TABS: TabSpec[] = [
  { id: 'home', label: 'Início', icon: HouseIcon },
  { id: 'tx', label: 'Transações', icon: ReceiptIcon },
  { id: 'scan', label: 'Escanear', icon: CameraIcon, fab: true },
  { id: 'me', label: 'Perfil', icon: UserIcon },
];

interface FloatingBottomNavProps {
  active: NavTab;
  onTabPress: (id: NavTab) => void;
}

export function FloatingBottomNav({
  active,
  onTabPress,
}: FloatingBottomNavProps) {
  return (
    <View className="absolute inset-x-0 bottom-0 px-4 pb-3.5 pt-2">
      <View
        className="h-[72px] flex-row items-center rounded-[36px] border border-white/[0.06] bg-[#141416]/95 px-2.5"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 18 },
          shadowOpacity: 0.6,
          shadowRadius: 40,
          elevation: 18,
        }}
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.id}
            tab={tab}
            active={active === tab.id}
            onPress={() => onTabPress(tab.id)}
          />
        ))}
      </View>
    </View>
  );
}

function Tab({
  tab,
  active,
  onPress,
}: {
  tab: TabSpec;
  active: boolean;
  onPress: () => void;
}) {
  const Icon = tab.icon;
  if (tab.fab) {
    return (
      <Pressable onPress={onPress} className="flex-1 items-center">
        <View
          className="h-14 w-14 items-center justify-center rounded-full bg-brand"
          style={{
            shadowColor: '#FFFFFF',
            shadowOffset: { width: 10, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 16,
            elevation: 3,
          }}
        >
          <Icon size={24} color="#000000" weight="bold" />
        </View>
      </Pressable>
    );
  }
  return (
    <Pressable
      onPress={onPress}
      className="relative flex-1 items-center justify-center gap-1 py-1.5"
    >
      <Icon
        size={22}
        color={active ? '#FFFFFF' : '#5E5E66'}
        weight={active ? 'bold' : 'regular'}
      />
      <Text
        className={
          active ? 'text-[11px] text-text' : 'text-[11px] text-text-mute'
        }
        style={{
          fontFamily: active ? 'Sora_700Bold' : 'Sora_600SemiBold',
        }}
      >
        {tab.label}
      </Text>
    </Pressable>
  );
}
