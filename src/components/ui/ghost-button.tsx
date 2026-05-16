import { cn } from '@/libs/utils';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface GhostButtonProps extends TouchableOpacityProps {
  text?: string;
}

export function GhostButton({
  text,
  className,
  children,
  ...props
}: GhostButtonProps) {
  return (
    <TouchableOpacity
      {...props}
      className={cn(
        'h-14 w-full flex-row items-center justify-center gap-2 rounded-2xl border-[1.5px] border-border bg-transparent',
        className
      )}
    >
      {text ? (
        <Text
          className="text-base text-text"
          style={{ fontFamily: 'Sora_600SemiBold' }}
        >
          {text}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
