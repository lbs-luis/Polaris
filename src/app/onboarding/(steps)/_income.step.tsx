import { RecurrenceDrawer } from '@/components/onboarding/recurrence/recurrence-drawer';
import { StepConfirmButton } from '@/components/onboarding/step-confirm-button';
import { StepHeader } from '@/components/onboarding/step-header';
import { useCalendarConstructor } from '@/hooks/calendar/use-calendar-constructor';
import { useIncomeStep } from '@/hooks/view-models/use-income-step';
import { IRenderStepProps } from '@/interfaces/onboarding.types';
import { cn } from '@/libs/utils';
import { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';

const DaySelectorButton = ({
  className,
  children,
  ...props
}: TouchableOpacityProps) => (
  <TouchableOpacity
    {...props}
    className={cn(
      'flex items-center justify-center self-start rounded-full border border-secondary-text/20 bg-surface-tertiary/80 px-3 py-1',
      className
    )}
  >
    <Text className="text-base font-medium text-primary-text">{children}</Text>
  </TouchableOpacity>
);

const HeaderWeekDay = ({ day }: { day: string }) => (
  <View className="flex flex-1 items-center justify-center py-2">
    <Text className="text-base font-normal text-text-primary">{day}</Text>
  </View>
);

const WeekDay = ({
  day,
  onSelect,
  hasRegistry,
}: {
  day: number | null;
  onSelect: (day: number) => void;
  hasRegistry: boolean;
}) => {
  function handleOnSelect() {
    if (day) onSelect(day);
  }

  return (
    <View className="relative flex flex-1">
      <TouchableOpacity
        className="flex w-full items-center justify-center rounded-xl py-2"
        onPress={handleOnSelect}
      >
        <Text
          className={cn(
            'text-base font-normal',
            day ? 'text-primary-text' : 'opacity-0'
          )}
        >
          {day ? day : 'D'}
        </Text>
      </TouchableOpacity>
      {hasRegistry && (
        <View className="absolute bottom-1 left-1/2 h-1 w-1 rounded-full bg-app-accent" />
      )}
    </View>
  );
};

export default function IncomeStep({ onNextStep }: IRenderStepProps) {
  const { weeks, weekDays, month, year } = useCalendarConstructor();
  const { registries, categories, isLoading, refresh } = useIncomeStep();
  const [day, setDay] = useState<number | null>(null);

  if (isLoading) return <View className="flex flex-1 bg-app-bg" />; // TODO: Criar um loading depois

  return (
    <>
      <StepHeader
        title="Receitas"
        description="Registre seus ganhos recorrentes."
      />

      <View className="mt-8 flex w-full flex-col justify-center rounded-xl bg-surface-secondary p-4">
        <Text className="text-xl font-semibold text-text-primary">{`${month} ${year}`}</Text>
        <View className="mt-4 flex w-full flex-row gap-1">
          {weekDays.map((day, i) => (
            <HeaderWeekDay day={day} key={`${i}-${day}`} />
          ))}
        </View>
        <View className="flex w-full flex-col gap-1">
          {weeks.map((week, wi) => (
            <View key={`week-${wi}`} className="flex w-full flex-row gap-1">
              {week.map((day, di) => (
                <WeekDay
                  day={day}
                  key={`week-${wi}-day-${di}`}
                  onSelect={setDay}
                  hasRegistry={
                    !!day &&
                    registries.some((registry) => registry.due_day === day)
                  }
                />
              ))}
            </View>
          ))}
        </View>
      </View>
      <View className="mt-4 flex flex-1 flex-col gap-4 pb-4">
        <Text className="self-start border-b border-text-secondary pb-2 pr-1 text-lg font-normal uppercase text-text-secondary">
          lançamentos
        </Text>
        <ScrollView className="flex flex-1 flex-col">
          {registries.map((registry, i) => (
            <Text
              className="text-sm font-normal text-text-primary"
              key={`${registry.due_day}-${i}`}
            >{`${registry.due_day} - ${registry.category_name}`}</Text>
          ))}
        </ScrollView>
      </View>
      <StepConfirmButton onNextStep={onNextStep} />
      <RecurrenceDrawer
        isOpen={!!day}
        day={day}
        categories={categories}
        onClose={() => setDay(null)}
        onSaved={refresh}
      />
    </>
  );
}
