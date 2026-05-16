import { KeyboardView } from '@/components/layout/keyboard-view.layout';
import { OnboardingFooter } from '@/components/layout/onboarding/onboarding-footer.layout';
import { AddRecurrenceForm } from '@/components/onboarding/recurrence/add-recurrence-form';
import { DayEntriesList } from '@/components/onboarding/recurrence/day-entries-list';
import { RecurrencyCalendar } from '@/components/onboarding/recurrence/recurrency-calendar';
import { StepHeader } from '@/components/onboarding/step-header';
import { Label } from '@/components/ui/label';
import { useBottomSheetContext } from '@/context/bottomsheet.context';
import { IRecurrentsTRow } from '@/database/tables/recurrents.table';
import { useRecurrenceStep } from '@/hooks/view-models/use-recurrence-step';
import { View } from 'react-native';

interface RecurrenceStepProps {
  type: 'income' | 'outcome';
  title: string;
  description: string;
  buttonText: string;
  onNextStep: () => void;
  onPreviousStep: () => void;
  isFirstStep: boolean;
}

export function RecurrenceStep({
  type,
  title,
  description,
  buttonText,
  onNextStep,
  onPreviousStep,
  isFirstStep,
}: RecurrenceStepProps) {
  const { registries, categories, isLoading, refresh, handleExclude } =
    useRecurrenceStep(type);

  const { openBottomSheet, closeBottomSheet } = useBottomSheetContext();

  const noun = type === 'income' ? 'entrada' : 'saída';

  function handleOnSaved() {
    closeBottomSheet();
    refresh();
  }

  function openCreateSheet(day: number) {
    openBottomSheet(
      <AddRecurrenceForm
        categories={categories}
        day={day}
        onSaved={handleOnSaved}
        type={type}
      />,
      { title: `Nova ${noun} · dia ${day}` }
    );
  }

  function handleOnEdit(item: IRecurrentsTRow) {
    openBottomSheet(
      <AddRecurrenceForm
        categories={categories}
        day={item.due_day}
        onSaved={handleOnSaved}
        type={type}
        recurrent={item}
      />,
      { title: `Editar ${noun} · dia ${item.due_day}` }
    );
  }

  return (
    <>
      <KeyboardView className="px-6 pb-4 pt-3">
        <StepHeader title={title} description={description} />

        <View className="mt-5">
          <RecurrencyCalendar
            type={type}
            isLoading={isLoading}
            registries={registries}
            onSelectDay={openCreateSheet}
          />
        </View>

        <View className="mt-6 gap-2">
          <Label label="Lançamentos" uppercase={false} />
          <DayEntriesList
            entries={registries}
            type={type}
            onEdit={handleOnEdit}
            onDelete={handleExclude}
          />
        </View>

        <View className="h-6" />
      </KeyboardView>

      <OnboardingFooter
        continueText={buttonText}
        onContinue={onNextStep}
        onBack={onPreviousStep}
        showBack={!isFirstStep}
      />
    </>
  );
}
