import { cn } from '@/libs/utils';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  text?: string;
  uppercase?: boolean;
}

/**
 * Primary action button. WHITE is the brand primary: a fully-rounded pill with
 * black label and a soft white "light effect" glow on the pure-black canvas
 * (One UI primary-button treatment). Disabled collapses to a flat surface tone.
 */
export function Button({
  text,
  className,
  disabled,
  uppercase = false,
  children,
  style,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      {...props}
      disabled={disabled}
      style={[
        disabled
          ? undefined
          : {
              shadowColor: '#FFFFFF',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.1,
              shadowRadius: 28,
              elevation: 4,
            },
        style,
      ]}
      className={cn(
        'flex h-14 w-full flex-row items-center justify-center gap-2 overflow-hidden rounded-full',
        disabled ? 'bg-surface-2' : 'bg-brand',
        className
      )}
    >
      {text ? (
        <Text
          className={cn(
            'text-lg',
            disabled ? 'text-text-mute' : 'text-text-inverse'
          )}
          style={{ fontFamily: 'Sora_700Bold', letterSpacing: 0.2 }}
        >
          {uppercase ? text.toUpperCase() : text}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
