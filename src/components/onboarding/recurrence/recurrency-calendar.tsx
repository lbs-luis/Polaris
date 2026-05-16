import { IRecurrentsTRow } from '@/database/tables/recurrents.table';
import { useCalendarConstructor } from '@/hooks/calendar/use-calendar-constructor';
import { cn } from '@/libs/utils';
import { Text, TouchableOpacity, View } from 'react-native';

const HeaderWeekDay = ({ day }: { day: string }) => (
  <View className="flex-1 items-center justify-center py-2">
    <Text
      className="text-xs text-text-dim"
      style={{ fontFamily: 'Sora_600SemiBold' }}
    >
      {day}
    </Text>
  </View>
);

interface WeekDayProps {
  day: number | null;
  hasRegistry: boolean;
  type: 'income' | 'outcome';
  onSelect: (day: number) => void;
}

const WeekDay = ({ day, hasRegistry, type, onSelect }: WeekDayProps) => {
  function handleOnSelect() {
    if (day) onSelect(day);
  }
  return (
    <View className="flex-1">
      <TouchableOpacity
        className="relative h-10 items-center justify-center rounded-tile"
        onPress={handleOnSelect}
        disabled={!day}
      >
        <Text
          className={cn('text-sm text-text', !day && 'opacity-0')}
          style={{ fontFamily: 'JetBrainsMono_500Medium' }}
        >
          {day ?? 'D'}
        </Text>
        {hasRegistry && (
          <View
            className={cn(
              'absolute bottom-1 h-1 w-1 rounded-full',
              type === 'income' ? 'bg-income' : 'bg-outcome'
            )}
          />
        )}
      </TouchableOpacity>
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

  if (isLoading) return <View className="bg-bg" style={{ height: 320 }} />;

  return (
    <View
      className={cn(
        'rounded-card border border-border-subtle bg-surface p-4',
        className
      )}
    >
      <Text
        className="text-sm lowercase text-text"
        style={{ fontFamily: 'Sora_700Bold' }}
      >
        {`${month} `}
        <Text
          className="text-text-dim"
          style={{ fontFamily: 'Sora_400Regular' }}
        >
          {year}
        </Text>
      </Text>
      <View className="mt-2 flex-row gap-1">
        {weekDays.map((day, i) => (
          <HeaderWeekDay day={day} key={`${i}-${day}`} />
        ))}
      </View>
      <View className="mt-1 flex-col gap-1">
        {weeks.map((week, wi) => (
          <View key={`week-${wi}`} className="flex-row gap-1">
            {week.map((day, di) => (
              <WeekDay
                key={`week-${wi}-day-${di}`}
                type={type}
                day={day}
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
