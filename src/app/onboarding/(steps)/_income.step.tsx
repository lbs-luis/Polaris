import { DismissKeyboardView } from '@/components/layout/dismiss-keyboard-view.layout';
import { AddRecurrenceForm } from '@/components/onboarding/recurrence/add-recurrence-form';

import { RecurrencyCalendar } from '@/components/onboarding/recurrence/recurrency-calendar';
import { RecurrencyRow } from '@/components/onboarding/recurrence/registry-row';
import { StepHeader } from '@/components/onboarding/step-header';
import { StepLabel } from '@/components/onboarding/step-label';
import { Button } from '@/components/ui/button';
import { useBottomSheetContext } from '@/context/bottomsheet.context';
import { useRecurrenceStep } from '@/hooks/view-models/use-recurrence-step';
import { IRenderStepProps } from '@/interfaces/onboarding.types';
import { FlatList, View } from 'react-native';

export default function IncomeStep({ onNextStep }: IRenderStepProps) {
  const { registries, categories, isLoading, refresh } =
    useRecurrenceStep('income');

  const { openBottomSheet } = useBottomSheetContext();

  return (
    <DismissKeyboardView className="px-6 pb-4" scroll={false}>
      <StepHeader
        title={`Entradas\nrecorrentes.`}
        description="Toque em um dia para registrar."
      />
      <RecurrencyCalendar
        type="income"
        isLoading={isLoading}
        onSelectDay={(day) =>
          openBottomSheet(
            <AddRecurrenceForm
              categories={categories}
              day={day}
              onSaved={refresh}
              type="income"
            />
          )
        }
        registries={registries}
        className="mt-6"
      />
      <View className="mt-4 flex flex-1 flex-col gap-2 pb-2">
        <StepLabel label="Lançamentos" uppercase={false} />
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

      <Button onPress={onNextStep} className="mt-auto" text="Continuar" />
    </DismissKeyboardView>
  );
}
