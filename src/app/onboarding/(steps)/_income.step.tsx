import { StepConfirmButton } from '@/components/onboarding/step-confirm-button';
import { StepHeader } from '@/components/onboarding/step-header';
import { useCalendarConstructor } from '@/hooks/use-calendar-constructor';
import { IRenderStepProps } from '@/interfaces/onboarding.types';
import { cn } from '@/libs/utils';
import {
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
      'flex h-14 flex-1 items-center justify-center rounded-xl border border-secondary-text/80 bg-secondary-bg-foreground',
      className
    )}
  >
    <Text className="text-lg font-medium text-primary-text">{children}</Text>
  </TouchableOpacity>
);

const HeaderWeekDay = ({ day }: { day: string }) => (
  <View className="flex flex-1 items-center justify-center py-2">
    <Text className="text-base font-normal text-primary-text">{day}</Text>
  </View>
);

const WeekDay = ({ day }: { day: number | null }) => (
  <TouchableOpacity className="flex flex-1 items-center justify-center rounded-xl bg-secondary-bg-foreground py-2">
    <Text
      className={cn(
        'text-base font-normal',
        day ? 'text-primary-text' : 'opacity-0'
      )}
    >
      {day ? day : 'D'}
    </Text>
  </TouchableOpacity>
);

export default function IncomeStep({ onNextStep }: IRenderStepProps) {
  const { weeks, weekDays } = useCalendarConstructor();

  return (
    <>
      <StepHeader>Registre suas entradas</StepHeader>
      <View className="mt-6 flex w-full flex-row gap-4">
        <DaySelectorButton>1 dia</DaySelectorButton>
        <DaySelectorButton>Último dia</DaySelectorButton>
      </View>
      <View className="mt-4 flex w-full flex-row gap-1 ">
        {weekDays.map((day, i) => (
          <HeaderWeekDay day={day} key={`${i}-${day}`} />
        ))}
      </View>
      <View className="flex w-full flex-col gap-1">
        {weeks.map((week, wi) => (
          <View key={`week-${wi}`} className="flex w-full flex-row gap-1">
            {week.map((day, di) => (
              <WeekDay day={day} key={`week-${wi}-day-${di}`} />
            ))}
          </View>
        ))}
      </View>
      <StepConfirmButton onNextStep={onNextStep} />
    </>
  );
}
