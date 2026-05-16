import { StepDots } from '@/components/onboarding/step-dots';
import { ISteps, steps } from '@/interfaces/onboarding.types';
import { View } from 'react-native';

interface OnboardingHeaderProps {
  currentStep: ISteps;
}

export function OnboardingHeader({ currentStep }: OnboardingHeaderProps) {
  const stepIndex = steps.indexOf(currentStep);
  return (
    <View className="h-10 justify-center">
      <StepDots step={stepIndex} total={steps.length} />
    </View>
  );
}
