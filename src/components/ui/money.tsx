import { cn } from '@/libs/utils';
import { Text, TextProps } from 'react-native';

interface MoneyProps extends TextProps {
  value: number;
  sign?: boolean;
  className?: string;
  bold?: boolean;
}

export function Money({
  value,
  sign = false,
  bold = false,
  className,
  style,
  ...rest
}: MoneyProps) {
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const prefix = sign ? (value >= 0 ? '+ ' : '− ') : '';

  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: bold
            ? 'JetBrainsMono_700Bold'
            : 'JetBrainsMono_500Medium',
          fontVariant: ['tabular-nums'],
          letterSpacing: -0.2,
        },
        style,
      ]}
      className={cn('text-base text-text', className)}
    >
      {prefix}R$ {formatted}
    </Text>
  );
}
