import { IRenderStepProps } from '@/interfaces/onboarding.types';
import { Text } from 'react-native';

export default function IncomeStep({ onNextStep }: IRenderStepProps) {
  return <Text className="text-xl font-semibold text-white">Receita</Text>;
}
