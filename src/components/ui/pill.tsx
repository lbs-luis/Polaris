import { cn } from '@/libs/utils';
import { Icon as PhosphorIcon } from 'phosphor-react-native';
import { PropsWithChildren } from 'react';
import { Text, View } from 'react-native';

type Tone = 'neutral' | 'brand' | 'income' | 'outcome' | 'warn';

const tones: Record<Tone, { bg: string; fg: string; hex: string }> = {
  neutral: { bg: 'bg-surface-2', fg: 'text-text-dim', hex: '#9C9CA6' },
  brand: { bg: 'bg-[#1A1A1C]', fg: 'text-text', hex: '#FFFFFF' },
  income: { bg: 'bg-[#0F1E13]', fg: 'text-income', hex: '#3CC85F' },
  outcome: { bg: 'bg-[#1F1010]', fg: 'text-outcome', hex: '#FF4D4D' },
  warn: { bg: 'bg-[#1F1A0D]', fg: 'text-warning', hex: '#FFB320' },
};

interface PillProps {
  tone?: Tone;
  /** Optional leading icon; tinted to match the tone foreground. */
  icon?: PhosphorIcon;
  className?: string;
}

export function Pill({
  children,
  tone = 'neutral',
  icon: IconCmp,
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
      {IconCmp ? <IconCmp size={12} color={t.hex} weight="bold" /> : null}
      <Text
        className={cn('text-xs', t.fg)}
        style={{ fontFamily: 'Sora_600SemiBold' }}
      >
        {children}
      </Text>
    </View>
  );
}
