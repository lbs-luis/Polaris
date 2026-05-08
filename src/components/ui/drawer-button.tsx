import { cn } from '@/libs/utils';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface DrawerButtonProps extends TouchableOpacityProps {
  text?: string;
}

export function DrawerButton({ text, className, ...props }: DrawerButtonProps) {
  return (
    <TouchableOpacity
      {...props}
      className={cn(
        'mt-4 flex flex-row items-center justify-center gap-2 rounded-xl bg-button-primary py-4',
        className
      )}
    >
      <Text
        className="text-base text-text-primary-muted"
        style={{ fontFamily: 'Sora_600SemiBold' }}
      >
        {text?.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
}
