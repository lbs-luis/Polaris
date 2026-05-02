import { CalendarStep } from '@/components/onboarding/calendar-step';
import { IRenderStepProps } from '@/interfaces/onboarding.types';

export default function IncomeStep({ onNextStep }: IRenderStepProps) {
  return (
    <CalendarStep
      title="Receitas"
      description="Registre seus ganhos recorrentes."
      type="income"
      onNextStep={onNextStep}
    />
  );
}
