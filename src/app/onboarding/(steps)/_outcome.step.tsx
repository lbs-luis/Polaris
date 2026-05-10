import { OnboardingBody } from '@/components/layout/onboarding/onboarding-body.layout';
import { AddRecurrenceForm } from '@/components/onboarding/recurrence/add-recurrence-form';

import { RecurrencyCalendar } from '@/components/onboarding/recurrence/recurrency-calendar';
import { RecurrencyRow } from '@/components/onboarding/recurrence/registry-row';
import { StepHeader } from '@/components/onboarding/step-header';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useBottomSheetContext } from '@/context/bottomsheet.context';
import { useRecurrenceStep } from '@/hooks/view-models/use-recurrence-step';
import { IRenderStepProps } from '@/interfaces/onboarding.types';
import { FlatList, View } from 'react-native';

export default function OutcomeStep({ onNextStep }: IRenderStepProps) {
  const { registries, categories, isLoading, refresh } =
    useRecurrenceStep('outcome');
  const { openBottomSheet } = useBottomSheetContext();

  return (
    <OnboardingBody className="px-6 pb-4">
      <StepHeader
        title={`Saídas\nrecorrentes.`}
        description="Toque em um dia para registrar."
      />

      <RecurrencyCalendar
        type="outcome"
        isLoading={isLoading}
        onSelectDay={(day) =>
          openBottomSheet(
            <AddRecurrenceForm
              categories={categories}
              day={day}
              onSaved={refresh}
              type="outcome"
            />
          )
        }
        registries={registries}
        className="mt-6"
      />
      <View className="mt-4 flex flex-1 flex-col gap-2 pb-2">
        <Label label="Lançamentos" uppercase={false} />
        <FlatList
          style={{ flex: 1 }}
          data={registries}
          renderItem={({ item }) => <RecurrencyRow item={item} />}
          keyExtractor={(item, i) => `${i}-${item.id}`}
          showsVerticalScrollIndicator={false}
          directionalLockEnabled={true}
          scrollEventThrottle={16}
        />
      </View>
      <Button onPress={onNextStep} className="mt-auto" text="Finalizar" />
    </OnboardingBody>
  );
}
