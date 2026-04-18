import { IRenderStepProps } from '@/interfaces/onboarding.types';
import { Text } from 'react-native';

export default function OutcomeStep({ onNextStep }: IRenderStepProps) {
  return <Text className="text-xl font-semibold text-white">Despesa</Text>;
}
