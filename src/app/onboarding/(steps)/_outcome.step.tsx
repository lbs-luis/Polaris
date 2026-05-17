import { RecurrenceStep } from '@/components/onboarding/recurrence/recurrence-step';
import { useSettingsTable } from '@/database/tables/settings.table';
import { IRenderStepProps } from '@/interfaces/onboarding.types';

export default function OutcomeStep({
  onNextStep,
  onPreviousStep,
  isFirstStep,
}: IRenderStepProps) {
  const { set } = useSettingsTable();

  async function handleNextStep() {
    await set({ sKey: 'onboarding_complete', sValue: 'true' });
    onNextStep();
  }

  return (
    <RecurrenceStep
      type="outcome"
      title={`Saídas\nrecorrentes.`}
      description="Toque em um dia para registrar."
      buttonText="Finalizar"
      onNextStep={handleNextStep}
      onPreviousStep={onPreviousStep}
      isFirstStep={isFirstStep}
    />
  );
}
