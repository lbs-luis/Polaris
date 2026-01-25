import { useDatabaseContext } from '@/contexts/DatabaseProvider';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function OnboardingScreen() {
  const router = useRouter();
  const { onboarding } = useDatabaseContext();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onboarding.complete();
      router.replace('/');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
      default:
        return <Step1 />;
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="py-6">
        <View className="flex w-full flex-row items-center justify-center gap-2 px-8">
          {Array.from({ length: totalSteps }, (_, index) => (
            <View
              key={index}
              className={`h-1 w-1/4 rounded-full ${
                index + 1 === currentStep ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </View>
        <Text className="mt-4 text-center text-lg font-semibold text-gray-800">
          Passo {currentStep} de {totalSteps}
        </Text>
      </View>

      <ScrollView className="flex-1 px-6">
        <View className="flex-1 justify-center">{renderStep()}</View>
      </ScrollView>

      <View className="flex-row items-center justify-between border-t border-gray-200 bg-white p-6">
        <TouchableOpacity
          onPress={handlePrevious}
          disabled={currentStep === 1}
          className={`rounded-lg px-6 py-3 ${
            currentStep === 1 ? 'bg-gray-100' : 'bg-gray-200'
          }`}
        >
          <Text
            className={`font-semibold ${
              currentStep === 1 ? 'text-gray-400' : 'text-gray-700'
            }`}
          >
            Anterior
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          className="rounded-lg bg-blue-500 px-6 py-3"
        >
          <Text className="font-semibold text-white">
            {currentStep === totalSteps ? 'Concluir' : 'Próximo'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Step1() {
  return (
    <View className="items-center">
      <Text className="mb-4 text-center text-2xl font-bold">Nome e Foto</Text>
      <Text className="text-center text-gray-600">
        Aqui você irá adicionar seu nome e foto de perfil
      </Text>
    </View>
  );
}

function Step2() {
  return (
    <View className="items-center">
      <Text className="mb-4 text-center text-2xl font-bold">
        Fontes de Renda
      </Text>
      <Text className="text-center text-gray-600">
        Adicione suas fontes de renda com nome, ícone, valor e data
      </Text>
    </View>
  );
}

function Step3() {
  return (
    <View className="items-center">
      <Text className="mb-4 text-center text-2xl font-bold">
        Categorias de Despesas
      </Text>
      <Text className="text-center text-gray-600">
        Confirme as categorias de despesas padrão ou crie as suas
      </Text>
    </View>
  );
}

function Step4() {
  return (
    <View className="items-center">
      <Text className="mb-4 text-center text-2xl font-bold">Confirmação</Text>
      <Text className="text-center text-gray-600">
        Revise suas informações e conclua o cadastro
      </Text>
    </View>
  );
}
