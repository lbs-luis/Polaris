import { theme } from '@/libs/theme';
import { Icon as PhosphorIcon, PlusIcon } from 'phosphor-react-native';
import { Pressable, Text, View } from 'react-native';

interface FabProps {
  onPress: () => void;
  icon?: PhosphorIcon;
  /** Optional label turns the primary button into an extended pill. */
  label?: string;
  /** Distance from the bottom of the screen (clears the bottom nav). */
  bottom?: number;
  /** Optional secondary action rendered as a dark circle left of the primary. */
  secondaryIcon?: PhosphorIcon;
  onSecondaryPress?: () => void;
}

const floatingShadow = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.5,
  shadowRadius: 28,
  elevation: 8,
};

/**
 * Floating create button, bottom-right, above the bottom nav. White is the
 * primary "add" affordance; an optional secondary (e.g. the scanner) sits to
 * its left as a dark circle so the white button stays the obvious primary.
 */
export function Fab({
  onPress,
  icon: PrimaryIcon = PlusIcon,
  label,
  bottom = 88,
  secondaryIcon: SecondaryIcon,
  onSecondaryPress,
}: FabProps) {
  return (
    <View
      className="absolute right-[18px] z-20 flex-row items-center gap-3"
      style={{ bottom }}
    >
      {SecondaryIcon && onSecondaryPress ? (
        <Pressable
          onPress={onSecondaryPress}
          className="h-14 w-14 items-center justify-center rounded-full border border-border bg-surface-2"
          style={floatingShadow}
        >
          <SecondaryIcon size={24} color={theme.text} weight="regular" />
        </Pressable>
      ) : null}

      <Pressable
        onPress={onPress}
        className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-white"
        style={[
          floatingShadow,
          { width: label ? undefined : 56, paddingHorizontal: label ? 22 : 0 },
        ]}
      >
        <PrimaryIcon size={22} color="#000000" weight="bold" />
        {label ? (
          <Text
            className="text-[15px] text-text-inverse"
            style={{ fontFamily: 'Sora_700Bold' }}
          >
            {label}
          </Text>
        ) : null}
      </Pressable>
    </View>
  );
}
