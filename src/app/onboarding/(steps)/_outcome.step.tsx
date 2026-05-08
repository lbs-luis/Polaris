import { OnboardingBody } from '@/components/layout/onboarding/onboarding-body.layout';
import { RecurrenceDrawer } from '@/components/onboarding/recurrence/recurrence-drawer';
import { RecurrencyCalendar } from '@/components/onboarding/recurrence/recurrency-calendar';
import { RecurrencyRow } from '@/components/onboarding/recurrence/registry-row';
import { StepConfirmButton } from '@/components/onboarding/step-confirm-button';
import { StepHeader } from '@/components/onboarding/step-header';
import { StepLabel } from '@/components/onboarding/step-label';
import { useRecurrenceStep } from '@/hooks/view-models/use-recurrence-step';
import { IRenderStepProps } from '@/interfaces/onboarding.types';
import { useState } from 'react';
import { FlatList, View } from 'react-native';

export default function OutcomeStep({ onNextStep }: IRenderStepProps) {
  const { registries, categories, isLoading, refresh } =
    useRecurrenceStep('outcome');

  const [drawerOptions, setDrawerOptions] = useState({ day: 0, isOpen: false });

  return (
    <OnboardingBody className="px-6 pb-4">
      <StepHeader
        title={`Saídas\nrecorrentes.`}
        description="Toque em um dia para registrar."
      />

      <RecurrencyCalendar
        type="outcome"
        isLoading={isLoading}
        onSelectDay={(day) => setDrawerOptions({ day, isOpen: true })}
        registries={registries}
        className="mt-6"
      />
      <View className="mt-4 flex flex-1 flex-col gap-2 pb-2">
        <StepLabel label="Lançamentos" uppercase={false} />
        <FlatList
          data={registries}
          renderItem={(item) => <RecurrencyRow item={item} />}
          keyExtractor={(item, i) => `${i}-${item.id}`}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <StepConfirmButton onNextStep={onNextStep} />
      <RecurrenceDrawer
        isOpen={drawerOptions.isOpen}
        day={drawerOptions.day}
        categories={categories}
        type={'outcome'}
        onClose={() =>
          setDrawerOptions({ day: drawerOptions.day, isOpen: false })
        }
        onSaved={refresh}
      />
    </OnboardingBody>
  );
}
