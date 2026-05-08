import { IRecurrentsTRow } from '@/database/tables/recurrents.table';
import { useCalendarConstructor } from '@/hooks/calendar/use-calendar-constructor';
import { cn } from '@/libs/utils';
import { Text, TouchableOpacity, View } from 'react-native';

const HeaderWeekDay = ({ day }: { day: string }) => (
  <View className="flex flex-1 items-center justify-center py-2">
    <Text
      className="text-xs text-text-secondary"
      style={{ fontFamily: 'Sora_400Regular' }}
    >
      {day}
    </Text>
  </View>
);

const WeekDay = ({
  day,
  onSelect,
  hasRegistry,
  type,
}: {
  day: number | null;
  onSelect: (day: number) => void;
  hasRegistry: boolean;
  type: 'income' | 'outcome';
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
          className={cn('text-sm', day ? 'text-text-primary/90' : 'opacity-0')}
          style={{ fontFamily: 'Sora_400Regular' }}
        >
          {day ? day : 'D'}
        </Text>
      </TouchableOpacity>
      {hasRegistry && (
        <View
          className={cn(
            'absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full',
            type === 'income' ? 'bg-income' : 'bg-outcome'
          )}
        />
      )}
    </View>
  );
};

interface RecurrencyCalendarProps {
  isLoading: boolean;
  registries: IRecurrentsTRow[];
  onSelectDay: (day: number) => void;
  type: 'income' | 'outcome';
  className?: string;
}

export function RecurrencyCalendar({
  type,
  isLoading,
  registries,
  onSelectDay,
  className,
}: RecurrencyCalendarProps) {
  const { weeks, weekDays, month, year } = useCalendarConstructor();

  if (isLoading) return <View className="flex flex-1 bg-app-bg" />;

  return (
    <View
      className={cn(
        'flex w-full rounded-[20px] bg-surface-primary p-4',
        className
      )}
    >
      <Text
        className="mx-auto text-sm lowercase text-text-primary"
        style={{ fontFamily: 'Sora_400Regular' }}
      >{`${month} ${year}`}</Text>
      <View className="mt-2 flex w-full flex-row gap-1">
        {weekDays.map((day, i) => (
          <HeaderWeekDay day={day} key={`${i}-${day}`} />
        ))}
      </View>
      <View className="flex w-full flex-col gap-1">
        {weeks.map((week, wi) => (
          <View key={`week-${wi}`} className="flex w-full flex-row gap-1">
            {week.map((day, di) => (
              <WeekDay
                type={type}
                day={day}
                key={`week-${wi}-day-${di}`}
                onSelect={onSelectDay}
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
  );
}
