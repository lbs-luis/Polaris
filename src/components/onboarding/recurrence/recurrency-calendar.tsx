import { IRecurrentsTRow } from '@/database/tables/recurrents.table';
import { useCalendarConstructor } from '@/hooks/calendar/use-calendar-constructor';
import { cn } from '@/libs/utils';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
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
}

export function RecurrencyCalendar({
  type,
  isLoading,
  registries,
  onSelectDay,
}: RecurrencyCalendarProps) {
  const { weeks, weekDays, month, year } = useCalendarConstructor();

  if (isLoading) return <View className="flex flex-1 bg-app-bg" />;

  return (
    <View className="mt-6 w-full">
      <LinearGradient
        colors={[
          'rgba(45,45,52,0.6)',
          'rgba(29,29,32,0.4)',
          'rgba(20,20,24,0.5)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 20,
        }}
      />
      <BlurView
        intensity={80}
        tint="dark"
        style={{
          borderRadius: 20,
          overflow: 'hidden',
          borderWidth: 0.5,
          borderColor: 'rgba(255,255,255,0.08)',
          backgroundColor: 'rgba(29,29,32,0.3)',
          padding: 14,
        }}
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
      </BlurView>
    </View>
  );
}
