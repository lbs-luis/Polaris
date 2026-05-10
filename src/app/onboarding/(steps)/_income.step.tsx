import { KeyboardView } from '@/components/layout/keyboard-view.layout';
import { AddRecurrenceForm } from '@/components/onboarding/recurrence/add-recurrence-form';

import { RecurrencyCalendar } from '@/components/onboarding/recurrence/recurrency-calendar';
import { RecurrencyRow } from '@/components/onboarding/recurrence/row.recurrence';
import { StepHeader } from '@/components/onboarding/step-header';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useBottomSheetContext } from '@/context/bottomsheet.context';
import { useRecurrenceStep } from '@/hooks/view-models/use-recurrence-step';
import { IRenderStepProps } from '@/interfaces/onboarding.types';
import { View } from 'react-native';

export default function IncomeStep({ onNextStep }: IRenderStepProps) {
  const { registries, categories, isLoading, refresh } =
    useRecurrenceStep('income');

  const { openBottomSheet, closeBottomSheet } = useBottomSheetContext();

  function handleOnSaved() {
    closeBottomSheet();
    refresh();
  }

  return (
    <>
      <View className="w-full px-6 pb-3">
        <StepHeader
          title={`Entradas\nrecorrentes.`}
          description="Toque em um dia para registrar."
        />
      </View>
      <KeyboardView className="px-6 pb-4 pt-3">
        <RecurrencyCalendar
          type="income"
          isLoading={isLoading}
          onSelectDay={(day) =>
            openBottomSheet(
              <AddRecurrenceForm
                categories={categories}
                day={day}
                onSaved={handleOnSaved}
                type="income"
              />
            )
          }
          registries={registries}
        />
        <View className="mt-6 flex flex-1 flex-col gap-2 pb-4">
          <Label label="Lançamentos" uppercase={false} />
          {registries.map((item, i) => (
            <RecurrencyRow item={item} key={`${item.id}-${i}`} />
          ))}
        </View>
      </KeyboardView>
      <View className="sticky  bottom-0 left-0  right-0 px-6  pb-4 pt-4">
        <Button onPress={onNextStep} className="mt-auto" text="Continuar" />
      </View>
    </>
  );
}
