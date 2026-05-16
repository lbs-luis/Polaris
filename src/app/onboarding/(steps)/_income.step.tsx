import { RecurrenceStep } from '@/components/onboarding/recurrence/recurrence-step';
import { IRenderStepProps } from '@/interfaces/onboarding.types';

export default function IncomeStep({
  onNextStep,
  onPreviousStep,
  isFirstStep,
}: IRenderStepProps) {
  return (
    <RecurrenceStep
      type="income"
      title={`Entradas\nrecorrentes.`}
      description="Toque em um dia para registrar."
      buttonText="Continuar"
      onNextStep={onNextStep}
      onPreviousStep={onPreviousStep}
      isFirstStep={isFirstStep}
    />
  );
}
