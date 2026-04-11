import { OnboardingHeader } from '@/components/layout/onboarding-header.layout';
import { ISteps, steps } from '@/interfaces/onboarding.types';
import { useState } from 'react';
import { View } from 'react-native';
import CategoryStep from './(steps)/_category.step';
import IncomeStep from './(steps)/_income.step';
import OutcomeStep from './(steps)/_outcome.step';
import UserStep from './(steps)/_user.step';

const Step = ({ currentStep }: { currentStep: ISteps }) => {
  switch (currentStep) {
    case 'user':
      return <UserStep />;
    case 'category':
      return <CategoryStep />;
    case 'income':
      return <IncomeStep />;
    case 'outcome':
      return <OutcomeStep />;
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
    <View className="flex size-full flex-col items-center ">
      <OnboardingHeader
        currentStep={currentStep}
        previousStep={handlePreviousStep}
      />

      <View className="flex h-full w-full flex-col p-6">
        <Step currentStep={currentStep} />
      </View>

      {/* <TouchableOpacity
        onPress={handleNextStep}
        className="flex flex-row items-center justify-center gap-4 rounded-full bg-[#3c56ec] px-6 py-4"
      >
        <Text className="text-xl font-semibold text-white">Confirmar</Text>
        <ChevronRight size={22} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handlePreviousStep}
        className="flex flex-row items-center justify-center gap-4 rounded-full bg-[#3c56ec] px-6 py-4"
      >
        <ChevronLeft size={22} color="#FFFFFF" />
        <Text className="text-xl font-semibold text-white">Anterior</Text>
      </TouchableOpacity> */}
    </View>
  );
}
