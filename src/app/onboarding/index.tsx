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

  function handleNextStep() {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    } else {
      router.replace('/home');
    }
  }
  function handlePreviousStep() {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  }

  return (
    <>
      <OnboardingHeader
        currentStep={currentStep}
        previousStep={handlePreviousStep}
      />
      <Step currentStep={currentStep} onNextStep={handleNextStep} />
    </>
  );
}
