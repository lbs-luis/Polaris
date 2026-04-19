import { OnboardingHeader } from '@/components/layout/onboarding-header.layout';
import { IRenderStepProps, ISteps, steps } from '@/interfaces/onboarding.types';
import { useState } from 'react';
import { View } from 'react-native';
import CategoryStep from './(steps)/_category.step';
import IncomeStep from './(steps)/_income.step';
import OutcomeStep from './(steps)/_outcome.step';
import UserStep from './(steps)/_user.step';

const Step = (props: IRenderStepProps) => {
  switch (props.currentStep) {
    case 'user':
      return <UserStep {...props} />;
    case 'category':
      return <CategoryStep {...props} />;
    case 'income':
      return <IncomeStep {...props} />;
    case 'outcome':
      return <OutcomeStep {...props} />;
  }
};

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState<ISteps>('user');

  function handleNextStep() {
    const currentIndex = steps.keys.indexOf(currentStep);
    if (currentIndex < steps.keys.length - 1) {
      setCurrentStep(steps.keys[currentIndex + 1]);
    }
  }
  function handlePreviousStep() {
    const currentIndex = steps.keys.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps.keys[currentIndex - 1]);
    }
  }

  return (
    <View className="flex flex-1 flex-col">
      <OnboardingHeader
        currentStep={currentStep}
        previousStep={handlePreviousStep}
      />

      <View className="flex flex-1 flex-col p-6">
        <Step currentStep={currentStep} onNextStep={handleNextStep} />
      </View>
    </View>
  );
}
