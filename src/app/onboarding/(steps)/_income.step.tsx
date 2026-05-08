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
import { ScrollView, View } from 'react-native';

export default function IncomeStep({ onNextStep }: IRenderStepProps) {
  const { registries, categories, isLoading, refresh } =
    useRecurrenceStep('income');

  const [drawerOptions, setDrawerOptions] = useState({ day: 0, isOpen: false });

  return (
    <OnboardingBody className="pb-4">
      <View className="px-6">
        <StepHeader
          title={`Entradas\nrecorrentes.`}
          description="Toque em um dia para registrar."
        />
      </View>
      <View className="relative mb-6 flex flex-1 flex-col  bg-red-400">
        <RecurrencyCalendar
          type="income"
          isLoading={isLoading}
          onSelectDay={(day) => setDrawerOptions({ day, isOpen: true })}
          registries={registries}
        />
        <View className="absolute bottom-0 mt-4 flex w-full flex-1 flex-col gap-4">
          <StepLabel label="Lançamentos" />
          <ScrollView className="flex flex-1 flex-col">
            {registries.map((registry, i) => (
              <RecurrencyRow
                registry={registry}
                key={`${i}-${registry.due_day}`}
              />
            ))}
          </ScrollView>
        </View>
      </View>

      <StepConfirmButton onNextStep={onNextStep} />
      <RecurrenceDrawer
        isOpen={drawerOptions.isOpen}
        day={drawerOptions.day}
        categories={categories}
        type={'income'}
        onClose={() =>
          setDrawerOptions({ day: drawerOptions.day, isOpen: false })
        }
        onSaved={refresh}
      />
    </OnboardingBody>
  );
}
