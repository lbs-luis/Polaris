import { theme } from '@/libs/theme';
import { Icon as PhosphorIcon } from 'phosphor-react-native';
import { Pressable, Text, View } from 'react-native';

export interface BarAction {
  label: string;
  icon?: PhosphorIcon;
  onPress?: () => void;
  /** White primary button (sits on the right, takes more width). */
  primary?: boolean;
  /** Tints a secondary button's label/icon red. */
  danger?: boolean;
}

/**
 * Bottom action bar for detail pages — actions live at the base of the screen,
 * within thumb reach. The primary (white) action sits on the right.
 */
export function ActionBar({ actions }: { actions: BarAction[] }) {
  return (
    <View className="flex-row gap-2.5 border-t border-border-subtle bg-bg px-4 pb-3.5 pt-3">
      {actions.map((action) => {
        const foreground = action.primary
          ? theme.brandFg
          : action.danger
            ? theme.outcome
            : theme.text;
        const ActionIcon = action.icon;
        return (
          <Pressable
            key={action.label}
            onPress={action.onPress}
            className={`h-13 flex-row items-center justify-center gap-2 rounded-full ${action.primary ? 'bg-white' : 'bg-surface'}`}
            style={{ flex: action.primary ? 1.7 : 1, height: 52 }}
          >
            {ActionIcon ? (
              <ActionIcon size={18} color={foreground} weight="bold" />
            ) : null}
            <Text
              className="text-[15.5px]"
              style={{ fontFamily: 'Sora_700Bold', color: foreground }}
            >
              {action.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
