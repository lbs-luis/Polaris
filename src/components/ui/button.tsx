import { cn } from '@/libs/utils';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  text?: string;
  uppercase?: boolean;
}

export function Button({
  text,
  className,
  disabled,
  uppercase = false,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      {...props}
      className={cn(
        'flex h-14 w-full flex-row items-center justify-center gap-2 overflow-hidden rounded-2xl',
        disabled ? 'bg-button-disabled' : 'bg-button-primary',
        className
      )}
    >
      <Text
        className="text-lg text-text-primary-muted"
        style={{ fontFamily: 'Sora_600SemiBold' }}
      >
        {uppercase ? text?.toUpperCase() : text}
      </Text>
    </TouchableOpacity>
  );
}
