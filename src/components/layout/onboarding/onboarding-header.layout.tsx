import { ISteps, steps } from '@/interfaces/onboarding.types';
import { ChevronLeft } from 'lucide-react-native';
import { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

function ProgressBar({ isActive }: { isActive: boolean }) {
  const active = useSharedValue(0);
  useEffect(() => {
    active.value = withTiming(isActive ? 1 : 0, { duration: 350 });
  }, [isActive, active]);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: 8 + active.value * 32,
      backgroundColor: interpolateColor(
        active.value,
        [0, 1],
        ['#454d5e', '#ffffff']
      ),
    };
  });
  return <Animated.View style={animatedStyle} className="h-2 rounded-full" />;
}

export function OnboardingHeader({
  currentStep,
  previousStep,
}: {
  currentStep: ISteps;
  previousStep: () => void;
}) {
  return (
    <View className="relative flex w-full flex-row items-center  justify-center py-6">
      {currentStep !== 'profile' && (
        <TouchableOpacity
          onPress={previousStep}
          className="absolute left-4 flex items-center justify-center rounded-full border border-border-default  bg-surface-primary p-2"
        >
          <ChevronLeft size={22} color="#ffffff" />
        </TouchableOpacity>
      )}
      <View className="m-auto flex flex-row items-center gap-2">
        {steps.map((step) => (
          <ProgressBar key={step} isActive={currentStep === step} />
        ))}
      </View>
    </View>
  );
}
