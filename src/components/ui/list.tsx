import { cn } from '@/libs/utils';
import { theme } from '@/libs/theme';
import { CaretRightIcon } from 'phosphor-react-native';
import { PropsWithChildren, ReactNode } from 'react';
import { Pressable, Text, View, ViewProps } from 'react-native';

/**
 * ListGroup — borderless rounded surface that clips its rows. The single
 * container used for EVERY list in the app, so all lists look identical.
 */
export function ListGroup({
  children,
  className,
  style,
}: PropsWithChildren<{ className?: string; style?: ViewProps['style'] }>) {
  return (
    <View
      style={style}
      className={cn('overflow-hidden rounded-card bg-surface', className)}
    >
      {children}
    </View>
  );
}

interface ListRowProps {
  /** Leading node (CatIcon / IconTile / Avatar). */
  left?: ReactNode;
  /** Left inset of the divider so it lines up under the text column. */
  leftInset?: number;
  title: string;
  titleBadge?: ReactNode;
  sub?: string;
  /** Trailing node (Money, count, etc). */
  right?: ReactNode;
  chevron?: boolean;
  onPress?: () => void;
  /** Inset hairline divider drawn at the top of the row (all but the first). */
  divider?: boolean;
}

/**
 * ListRow — THE row used everywhere: leading node · title (+inline badge) ·
 * subtitle · trailing node · optional chevron. Divider is inset under the text
 * column (One UI). Comfortable ~64px height.
 */
export function ListRow({
  left,
  leftInset = 74,
  title,
  titleBadge,
  sub,
  right,
  chevron,
  onPress,
  divider,
}: ListRowProps) {
  const Wrap = onPress ? Pressable : View;
  return (
    <Wrap onPress={onPress} className="bg-surface">
      {divider ? (
        <View
          className="h-px bg-border-subtle"
          style={{ marginLeft: leftInset }}
        />
      ) : null}
      <View className="flex-row items-center gap-3.5 px-[18px] py-[15px]">
        {left}
        <View className="min-w-0 flex-1">
          <View className="flex-row items-center gap-1.5">
            <Text
              numberOfLines={1}
              className="shrink text-base text-text"
              style={{ fontFamily: 'Sora_600SemiBold', letterSpacing: -0.1 }}
            >
              {title}
            </Text>
            {titleBadge}
          </View>
          {sub ? (
            <Text
              numberOfLines={1}
              className="mt-0.5 text-[13.5px] text-text-dim"
              style={{ fontFamily: 'Sora_400Regular' }}
            >
              {sub}
            </Text>
          ) : null}
        </View>
        {right}
        {chevron ? (
          <CaretRightIcon size={18} color={theme.textMute} weight="bold" />
        ) : null}
      </View>
    </Wrap>
  );
}

interface SectionProps {
  /** Small right-aligned meta (e.g. a count). */
  right?: string;
  className?: string;
}

/**
 * Section — small uppercase overline that sits above a ListGroup, with an
 * optional right-aligned meta value.
 */
export function Section({
  children,
  right,
  className,
}: PropsWithChildren<SectionProps>) {
  return (
    <View
      className={cn(
        'flex-row items-baseline justify-between px-2.5 pb-2.5',
        className
      )}
    >
      <Text
        className="text-xs uppercase text-text-mute"
        style={{ fontFamily: 'Sora_700Bold', letterSpacing: 0.6 }}
      >
        {children}
      </Text>
      {right ? (
        <Text
          className="text-[13px] text-text-dim"
          style={{ fontFamily: 'Sora_600SemiBold' }}
        >
          {right}
        </Text>
      ) : null}
    </View>
  );
}
