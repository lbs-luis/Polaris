import { OnboardingBody } from '@/components/layout/onboarding-body.layout';
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
    <OnboardingBody className="pb-6">
      <View className="px-6">
        <StepHeader
          title={`Entradas\nrecorrentes.`}
          description="Toque em um dia para registrar."
        />
      </View>
      <View className="px-6">
        <RecurrencyCalendar
          type="income"
          isLoading={isLoading}
          onSelectDay={(day) => setDrawerOptions({ day, isOpen: true })}
          registries={registries}
        />
      </View>
      <View className="mt-4 flex w-full flex-1 flex-col gap-4">
        <View className="px-6">
          <StepLabel label="Lançamentos" />
        </View>
        <ScrollView className="flex flex-1 flex-col px-6">
          {registries.map((registry, i) => (
            <RecurrencyRow
              registry={registry}
              key={`${i}-${registry.due_day}`}
            />
          ))}
        </ScrollView>
      </View>

      <View className="px-6">
        <StepConfirmButton onNextStep={onNextStep} />
      </View>
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
