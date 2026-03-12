import { Button } from '@/components/button';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';

import { useState } from 'react';
import { View } from 'react-native';
import { twMerge } from 'tailwind-merge';

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };
  const handlePrevius = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <View className="flex size-full flex-col p-4">
      <View className="flex h-1 w-full flex-row  items-center justify-center gap-3">
        {Array.from({ length: 4 }).map((_, step) => (
          <View
            key={step}
            className={twMerge(
              'h-full w-[50px] rounded-full  bg-white',
              currentStep === step ? 'bg-blue-300' : 'bg-white'
            )}
          />
        ))}
      </View>
      <View className="ml-auto mt-auto flex flex-row gap-4">
        <Button onPress={handlePrevius} className="size-16 rounded-full p-4">
          <ArrowLeft color="#ffffff" strokeWidth={2} size={24} />
        </Button>
        <Button onPress={handleNext} className="size-16 rounded-full p-4">
          <ArrowRight color="#ffffff" strokeWidth={2} size={24} />
        </Button>
      </View>
    </View>
  );
}
