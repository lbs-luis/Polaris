import { cn } from '@/libs/utils';

import { ArrowRight } from 'lucide-react-native';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface StepConfirmButtonProps extends TouchableOpacityProps {
  onNextStep: () => void;
}
export function StepConfirmButton({
  onNextStep,
  className,
  children,
  ...props
}: StepConfirmButtonProps) {
  return (
    <TouchableOpacity
      className={cn(
        'mt-auto flex w-full flex-row items-center justify-center gap-3 overflow-hidden rounded-full bg-app-accent py-4',
        className
      )}
      onPress={onNextStep}
      {...props}
    >
      <Text className="text-xl font-extrabold text-app-accent-muted">
        {children ? children : 'Continuar'}
      </Text>
      <ArrowRight color="#0A305F" size={20} strokeWidth={2} />
    </TouchableOpacity>
  );
}
