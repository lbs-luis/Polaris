import { Money } from '@/components/ui/money';
import { cn } from '@/libs/utils';
import { ReactNode } from 'react';
import { Text, View } from 'react-native';

interface DetailHeroProps {
  icon: ReactNode;
  title: string;
  pill?: ReactNode;
  amount: number;
  caption?: string;
}

/** Centered hero for detail pages: icon, name, status pill, big amount, caption. */
export function DetailHero({
  icon,
  title,
  pill,
  amount,
  caption,
}: DetailHeroProps) {
  return (
    <View className="items-center rounded-card bg-surface px-6 py-7">
      {icon}
      <Text
        numberOfLines={2}
        className="mt-4 text-center text-xl text-text"
        style={{ fontFamily: 'Sora_700Bold', letterSpacing: -0.3 }}
      >
        {title}
      </Text>
      {pill ? <View className="mt-3">{pill}</View> : null}
      <Money
        value={amount}
        sign
        bold
        className={cn(
          'mt-4 text-[36px]',
          amount >= 0 ? 'text-income' : 'text-text'
        )}
        style={{ letterSpacing: -1 }}
      />
      {caption ? (
        <Text
          className="mt-2 text-[13px] text-text-dim"
          style={{ fontFamily: 'Sora_400Regular' }}
        >
          {caption}
        </Text>
      ) : null}
    </View>
  );
}
