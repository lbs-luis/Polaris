import { cn } from '@/libs/utils';

import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface StepConfirmButtonProps extends TouchableOpacityProps {
  onNextStep: () => void;
  disabled?: boolean;
}
export function StepConfirmButton({
  onNextStep,
  className,
  children,
  disabled = false,
  ...props
}: StepConfirmButtonProps) {
  return (
    <TouchableOpacity
      className={cn(
        'mt-auto flex h-14 w-full flex-row items-center justify-center gap-2 overflow-hidden rounded-2xl',
        disabled ? 'bg-button-disabled' : 'bg-button-primary',
        className
      )}
      onPress={onNextStep}
      {...props}
    >
      <Text
        className="text-text-primary-muted text-lg"
        style={{ fontFamily: 'Sora_700Bold' }}
      >
        {children ? children : 'Continuar'}
      </Text>
    </TouchableOpacity>
  );
}
