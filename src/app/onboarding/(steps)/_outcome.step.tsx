import { CalendarStep } from '@/components/onboarding/calendar-step';
import { useSettingsTable } from '@/database/tables/settings.table';
import { IRenderStepProps } from '@/interfaces/onboarding.types';
import { useCallback } from 'react';

export default function OutcomeStep({ onNextStep }: IRenderStepProps) {
  const { set: setSetting } = useSettingsTable();

  const handleComplete = useCallback(async () => {
    await setSetting({ sKey: 'onboarding_complete', sValue: 'true' });
    onNextStep();
  }, [onNextStep, setSetting]);

  return (
    <CalendarStep
      title="Despesas"
      description="Registre seus gastos recorrentes."
      type="outcome"
      onNextStep={handleComplete}
    />
  );
}
