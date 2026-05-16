import { OnboardingHeader } from '@/components/layout/onboarding/onboarding-header.layout';
import { IRenderStepProps, ISteps, steps } from '@/interfaces/onboarding.types';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import CategoryStep from './(steps)/_category.step';
import IncomeStep from './(steps)/_income.step';
import OutcomeStep from './(steps)/_outcome.step';
import ProfileStep from './(steps)/_profile.step';

const Step = (props: IRenderStepProps) => {
  switch (props.currentStep) {
    case 'profile':
      return <ProfileStep {...props} />;
    case 'category':
      return <CategoryStep {...props} />;
    case 'income':
      return <IncomeStep {...props} />;
    case 'outcome':
      return <OutcomeStep {...props} />;
  }
};

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<ISteps>('profile');

  const currentIndex = steps.indexOf(currentStep);
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === steps.length - 1;

  function handleNextStep() {
    if (isLastStep) {
      router.replace('/home');
    } else {
      setCurrentStep(steps[currentIndex + 1]);
    }
  }

  function handlePreviousStep() {
    if (!isFirstStep) setCurrentStep(steps[currentIndex - 1]);
  }

  return (
    <>
      <OnboardingHeader currentStep={currentStep} />
      <Step
        currentStep={currentStep}
        onNextStep={handleNextStep}
        onPreviousStep={handlePreviousStep}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
      />
    </>
  );
}
