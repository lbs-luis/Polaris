import { RecurrenceStep } from '@/components/onboarding/recurrence/recurrence-step';
import { IRenderStepProps } from '@/interfaces/onboarding.types';

export default function OutcomeStep({
  onNextStep,
  onPreviousStep,
  isFirstStep,
}: IRenderStepProps) {
  return (
    <RecurrenceStep
      type="outcome"
      title={`Saídas\nrecorrentes.`}
      description="Toque em um dia para registrar."
      buttonText="Finalizar"
      onNextStep={onNextStep}
      onPreviousStep={onPreviousStep}
      isFirstStep={isFirstStep}
    />
  );
}
