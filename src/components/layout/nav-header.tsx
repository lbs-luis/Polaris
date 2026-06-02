import { cn } from '@/libs/utils';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon } from 'phosphor-react-native';
import { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface NavHeaderProps {
  title: string;
  description?: string;
  /** Shows the back-chevron in the left slot; uses `router.back()` by default. */
  back?: boolean;
  /** Right-side action slot (icon buttons). */
  right?: ReactNode;
}

/**
 * App-wide navigation header. Main pages mount it without `back`; secondary
 * pages (detail, recurrents, etc.) pass `back` so the chevron appears. The
 * optional `right` slot hosts page-level actions (e.g. trash, plus pill)
 * and floats opposite the chevron on the same row.
 */
export function NavHeader({ title, description, back, right }: NavHeaderProps) {
  const router = useRouter();

  return (
    <View
      className={cn('mb-7 flex flex-col px-4 pt-2', back ? 'mt-0' : 'mt-14')}
    >
      <View className="flex-row items-center justify-between">
        {back ? (
          <TouchableOpacity onPress={() => router.back()}>
            <View className="self-start p-4 pl-0">
              <ArrowLeftIcon size={21} color="#ffffff" weight="bold" />
            </View>
          </TouchableOpacity>
        ) : (
          <View />
        )}
        {right ?? <View />}
      </View>
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
