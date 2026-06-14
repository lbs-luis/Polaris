import { theme } from '@/libs/theme';
import { cn } from '@/libs/utils';
import {
  ArrowsClockwiseIcon,
  HouseIcon,
  Icon as PhosphorIcon,
  ReceiptIcon,
  UserIcon,
} from 'phosphor-react-native';
import { Pressable, Text, View } from 'react-native';

export type NavTab = 'home' | 'tx' | 'rec' | 'me';

interface TabSpec {
  id: NavTab;
  label: string;
  icon: PhosphorIcon;
}

const TABS: TabSpec[] = [
  { id: 'home', label: 'Início', icon: HouseIcon },
  { id: 'tx', label: 'Transações', icon: ReceiptIcon },
  { id: 'rec', label: 'Recorrências', icon: ArrowsClockwiseIcon },
  { id: 'me', label: 'Perfil', icon: UserIcon },
];

interface BottomNavProps {
  active: NavTab;
  onTabPress: (id: NavTab) => void;
}

/**
 * BottomNav — flat, One UI–native tab bar flush to the bottom with a hairline
 * top divider. Four equal tabs (icon over label); the active tab gets a white
 * icon + bold label sitting in a soft rounded highlight pill. These four tabs
 * are the app's only roots — none of them has a back arrow.
 */
export function BottomNav({ active, onTabPress }: BottomNavProps) {
  return (
    <View className="flex-row border-t border-border-subtle bg-bg px-2.5 pb-3 pt-2">
      {TABS.map((tab) => {
        const on = active === tab.id;
        const Icon = tab.icon;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onTabPress(tab.id)}
            className="flex-1 items-center gap-1.5 py-1"
          >
            <View
              className={cn(
                'h-8 w-16 items-center justify-center rounded-2xl',
                on ? 'bg-white/10' : 'bg-transparent'
              )}
            >
              <Icon
                size={23}
                color={on ? theme.text : theme.textMute}
                weight={on ? 'fill' : 'regular'}
              />
            </View>
            <Text
              className={cn(
                'text-[11.5px]',
                on ? 'text-text' : 'text-text-mute'
              )}
              style={{
                fontFamily: on ? 'Sora_700Bold' : 'Sora_600SemiBold',
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
