import { cn } from '@/libs/utils';
import { LinearGradient } from 'expo-linear-gradient';
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
      className={cn('mt-auto w-full overflow-hidden rounded-3xl', className)}
      onPress={onNextStep}
      {...props}
    >
      <LinearGradient
        colors={['#3D5AFE', '#37438B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="flex flex-row items-center justify-center gap-2  py-6"
      >
        <Text className="text-xl font-semibold text-white">
          {children ? children : 'Continuar'}
        </Text>
        <ArrowRight color="#ffffff" size={24} />
      </LinearGradient>
    </TouchableOpacity>
  );
}
