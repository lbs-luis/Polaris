import { useCalendarConstructor } from '@/hooks/calendar/use-calendar-constructor';
import { cn } from '@/libs/utils';
import { Pressable, Text, View } from 'react-native';

interface CalendarPickerProps {
  /** Day-of-month currently chosen by the user, if any. */
  selected: number | null;
  /** Days that already have an active recurrent of the same type — render a
   *  small dot under them so the user can spot occupied slots. */
  occupiedDays?: number[];
  /** "Occupancy dot" tone — matches the type the user is creating. */
  occupiedTone?: 'income' | 'outcome';
  onSelect: (day: number) => void;
}

/**
 * Calendar grid shown inside the day-picker modal. Visually mirrors the
 * design's `CalendarPicker`: rounded surface-2 container, month label,
 * day-of-week row, and a 7-column grid where the selected day has a
 * brand-filled cell and occupied days get a tinted dot below the number.
 *
 * Month/year are derived from "today" — for a monthly recurrence only
 * the day-of-month matters, so we intentionally skip prev/next navigation.
 */
export function CalendarPicker({
  selected,
  occupiedDays = [],
  occupiedTone = 'outcome',
  onSelect,
}: CalendarPickerProps) {
  const { weeks, weekDays, month, year } = useCalendarConstructor();
  const dotColor = occupiedTone === 'income' ? 'bg-income' : 'bg-outcome';

  return (
    <View className="rounded-card border border-border-subtle bg-surface-2 p-3">
      <View className="flex-row items-center justify-between px-2 pb-3">
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
      </View>

      <View className="flex-row">
        {weekDays.map((dow, i) => (
          <View key={`dow-${i}`} className="flex-1 items-center py-1.5">
            <Text
              className={cn(
                'text-[11px]',
                i === 0 || i === 6 ? 'text-text-mute' : 'text-text-dim'
              )}
              style={{ fontFamily: 'Sora_600SemiBold' }}
            >
              {dow}
            </Text>
          </View>
        ))}
      </View>

      <View className="gap-1">
        {weeks.map((week, wi) => (
          <View key={`w-${wi}`} className="flex-row gap-1">
            {week.map((day, di) => {
              if (day === null) {
                return <View key={`w${wi}-d${di}`} className="h-10 flex-1" />;
              }
              const isSelected = selected === day;
              const isOccupied = occupiedDays.includes(day);
              return (
                <Pressable
                  key={`w${wi}-d${di}`}
                  onPress={() => onSelect(day)}
                  className={cn(
                    'h-10 flex-1 items-center justify-center rounded-[10px]',
                    isSelected ? 'bg-brand' : ''
                  )}
                >
                  <Text
                    className={cn(
                      'text-sm',
                      isSelected ? 'text-bg' : 'text-text'
                    )}
                    style={{
                      fontFamily: isSelected
                        ? 'JetBrainsMono_700Bold'
                        : 'JetBrainsMono_500Medium',
                    }}
                  >
                    {day}
                  </Text>
                  {isOccupied && !isSelected ? (
                    <View
                      className={cn(
                        'absolute bottom-1 h-1 w-1 rounded-full',
                        dotColor
                      )}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}
