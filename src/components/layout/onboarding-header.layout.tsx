import { ISteps, steps } from '@/interfaces/onboarding.types';
import { ArrowLeft } from 'lucide-react-native';
import { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

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
        ['#31353F', '#D6E3FF']
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
    <View className="flex w-full flex-row px-6 py-4">
      <View className="flex flex-row items-center gap-6">
        <TouchableOpacity
          onPress={previousStep}
          className={twMerge(
            'transition-all duration-[350ms] ease-out',
            currentStep === 'user' ? '-ml-11' : 'ml-0'
          )}
        >
          <ArrowLeft size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-lg font-medium text-white">Onboarding</Text>
      </View>
      <View className="ml-auto flex flex-row items-center gap-2">
        {steps.keys.map((step) => (
          <ProgressBar key={step} isActive={currentStep === step} />
        ))}
      </View>
    </View>
  );
}
