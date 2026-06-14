import { theme } from '@/libs/theme';
import { cn } from '@/libs/utils';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon } from 'phosphor-react-native';
import { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

interface NavHeaderProps {
  title?: string;
  caption?: string;
  /** Back-compat alias for `caption`. */
  description?: string;
  /** Shows the back arrow in the left slot; uses `router.back()` by default. */
  back?: boolean;
  /** Override the default `router.back()` behaviour. */
  onBack?: () => void;
  /** Right-side action slot (IconButton, pill, etc.). */
  right?: ReactNode;
  titleSize?: number;
}

/**
 * PageHeader — the One UI large-title header mounted on every top-level page.
 * An optional action row (back arrow + right actions), then the big bold title
 * and an optional caption. Generous top breathing room; calm on black.
 *
 * Root tab pages mount it without `back`; stacked inner pages (detail,
 * concluded, etc.) pass `back` so the arrow appears.
 */
export function NavHeader({
  title,
  caption,
  description,
  back,
  onBack,
  right,
  titleSize = 32,
}: NavHeaderProps) {
  const router = useRouter();
  const cap = caption ?? description;
  const hasActionRow = back || right;

  return (
    <View className={cn('mb-2 flex-col px-6 py-2', back ? 'mt-1' : 'mt-12')}>
      {hasActionRow ? (
        <View className="-mx-2 h-12 flex-row items-center">
          {back ? (
            <Pressable
              onPress={onBack ?? (() => router.back())}
              hitSlop={8}
              className="h-11 w-11 items-center justify-center rounded-full"
            >
              <ArrowLeftIcon size={24} color={theme.text} weight="bold" />
            </Pressable>
          ) : (
            <View className="w-2" />
          )}
          <View className="flex-1" />
          <View className="flex-row items-center">{right}</View>
        </View>
      ) : null}

      {title ? (
        <View className={hasActionRow ? 'pb-2 pt-2.5' : 'py-2'}>
          <Text
            className="text-text"
            style={{
              fontFamily: 'Sora_700Bold',
              fontSize: titleSize,
              letterSpacing: -0.8,
              lineHeight: titleSize * 1.1,
            }}
          >
            {title}
          </Text>
          {cap ? (
            <Text
              className="mt-2 text-[15px] text-text-dim"
              style={{ fontFamily: 'Sora_400Regular', lineHeight: 21 }}
            >
              {cap}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
