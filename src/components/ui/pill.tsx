import { cn } from '@/libs/utils';
import { PropsWithChildren } from 'react';
import { Text, View } from 'react-native';

type Tone = 'neutral' | 'brand' | 'income' | 'outcome' | 'warn';

const tones: Record<Tone, { bg: string; fg: string }> = {
  neutral: { bg: 'bg-surface-2', fg: 'text-text-dim' },
  brand: { bg: 'bg-surface-2', fg: 'text-text' },
  income: { bg: 'bg-[#0F1E13]', fg: 'text-income' },
  outcome: { bg: 'bg-[#1F1010]', fg: 'text-outcome' },
  warn: { bg: 'bg-[#1F1A0D]', fg: 'text-warning' },
};

interface PillProps {
  tone?: Tone;
  className?: string;
}

export function Pill({
  children,
  tone = 'neutral',
  className,
}: PropsWithChildren<PillProps>) {
  const t = tones[tone];
  return (
    <View
      className={cn(
        'flex-row items-center gap-1.5 rounded-full px-2.5 py-1',
        t.bg,
        className
      )}
    >
      <Text
        className={cn('text-xs', t.fg)}
        style={{ fontFamily: 'Sora_600SemiBold' }}
      >
        {children}
      </Text>
    </View>
  );
}
