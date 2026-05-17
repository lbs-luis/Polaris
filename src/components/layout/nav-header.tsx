import { cn } from '@/libs/utils';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon } from 'phosphor-react-native';
import { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface NavHeaderProps {
  title: string;
  description?: string;
  /**
   * `large` — main pages (in the bottom nav). Renders an empty 48px top
   *   bar (back/right slots only) followed by a 32px / 800-weight title row.
   * `compact` — secondary pages. Renders the title inline at 18px / 700.
   * Defaults to `compact`.
   */
  /** Shows the back-chevron in the left slot; uses `router.back()` by default. */
  back?: boolean;
  /** Right-side action slot (icon buttons). */
  right?: ReactNode;
}

const BACK_BUTTON_SIZE = 44;

/**
 * App-wide navigation header faithful to the design's `TopBar`.
 *
 * Use `variant="large"` for any page rooted in the floating bottom nav
 * (Transações, Perfil — Home keeps its custom greeting header) so the
 * page title lands as a 32px expanded headline below the back/action bar.
 *
 * Use the default `compact` variant for secondary pages reachable via
 * navigation (detail, recurrents, etc.) so the title sits inline next to
 * the back chevron at 18px.
 */
export function NavHeader({ title, description, back }: NavHeaderProps) {
  const router = useRouter();

  return (
    <View
      className={cn('mb-7 flex  flex-col px-4 pt-2', back ? ' mt-0' : 'mt-14')}
    >
      {back && (
        <TouchableOpacity onPress={() => router.back()}>
          <View className="self-start p-4 pl-0">
            <ArrowLeftIcon size={21} color="#ffffff" weight="bold" />
          </View>
        </TouchableOpacity>
      )}
      <Text
        className="mt-2 text-3xl text-text"
        style={{ fontFamily: 'Sora_700Bold' }}
      >
        {title}
      </Text>
      {description && (
        <Text
          className="mt-1.5 text-lg text-text-dim"
          style={{ fontFamily: 'Sora_400Regular' }}
        >
          {description}
        </Text>
      )}
    </View>
  );
}
