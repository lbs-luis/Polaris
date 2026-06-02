import { cn } from '@/libs/utils';
import { Pressable, Text, View } from 'react-native';

const MONTH_ABBR = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

export interface DateTimeValue {
  /** 1-based */
  day: number;
  /** 0-based (JS Date convention) */
  month: number;
  year: number;
  /** 0–23 */
  hour: number;
  /** 0–59 */
  minute: number;
}

interface DateTimeWheelProps {
  value: DateTimeValue;
  onChange: (next: DateTimeValue) => void;
  /** Used to tint the small accent stripe on the left of the selection band. */
  accent?: string;
}

const ROW_HEIGHT = 34;
const VISIBLE_OFFSETS = [-2, -1, 0, 1, 2];

/**
 * Static 5-column date-time picker (day · month · year · hour · minute).
 *
 * Each column shows 5 rows: 2 above the selected value (faded), the
 * selected value (bold), and 2 below (faded). Tapping any neighbour row
 * advances/rewinds the value by that many steps. This matches the design
 * mock — no spring physics, no overscroll, but enough affordance to land
 * on any datetime without typing.
 */
export function DateTimeWheel({
  value,
  onChange,
  accent = '#FFFFFF',
}: DateTimeWheelProps) {
  const daysInMonth = new Date(value.year, value.month + 1, 0).getDate();
  const safeDay = Math.min(value.day, daysInMonth);

  const set = (patch: Partial<DateTimeValue>) => {
    let next = { ...value, ...patch };
    // Clamp day if month/year change shrinks the month.
    const dim = new Date(next.year, next.month + 1, 0).getDate();
    if (next.day > dim) next = { ...next, day: dim };
    onChange(next);
  };

  return (
    <View
      className="mt-2 overflow-hidden rounded-tile border border-border-subtle bg-surface"
      style={{ height: ROW_HEIGHT * 5 + 18, position: 'relative' }}
    >
      {/* Selection band */}
      <View
        pointerEvents="none"
        className="absolute left-0 right-0 border-y border-border-subtle bg-white/5"
        style={{
          top: '50%',
          height: ROW_HEIGHT,
          marginTop: -(ROW_HEIGHT / 2),
        }}
      />
      {/* Accent stripe */}
      <View
        pointerEvents="none"
        className="absolute rounded"
        style={{
          left: 6,
          top: '50%',
          width: 3,
          height: ROW_HEIGHT - 10,
          marginTop: -((ROW_HEIGHT - 10) / 2),
          backgroundColor: accent,
          opacity: 0.7,
        }}
      />

      <View className="flex-row items-stretch px-2 pb-4 pt-1">
        <WheelColumn
          flex={1}
          values={range(1, daysInMonth)}
          selected={safeDay}
          format={(v) => String(v).padStart(2, '0')}
          onPick={(v) => set({ day: v })}
        />
        <WheelColumn
          flex={1.3}
          values={range(0, 12)}
          selected={value.month}
          format={(v) => MONTH_ABBR[v]}
          onPick={(v) => set({ month: v })}
        />
        <WheelColumn
          flex={1.1}
          values={range(value.year - 3, value.year + 4)}
          selected={value.year}
          format={(v) => String(v)}
          onPick={(v) => set({ year: v })}
        />
        <View
          style={{ width: 14, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text
            className="text-base text-text-dim"
            style={{ fontFamily: 'JetBrainsMono_500Medium' }}
          >
            :
          </Text>
        </View>
        <WheelColumn
          flex={0.9}
          values={range(0, 24)}
          selected={value.hour}
          format={(v) => String(v).padStart(2, '0')}
          onPick={(v) => set({ hour: v })}
        />
        <WheelColumn
          flex={0.9}
          values={range(0, 60)}
          selected={value.minute}
          format={(v) => String(v).padStart(2, '0')}
          onPick={(v) => set({ minute: v })}
        />
      </View>

      <View
        pointerEvents="none"
        className="absolute bottom-1 left-0 right-0 flex-row px-2"
      >
        {['DIA', 'MÊS', 'ANO', '', 'H', 'MIN'].map((label, i) => {
          const flexValues = [1, 1.3, 1.1, 0, 0.9, 0.9];
          if (i === 3) {
            return <View key={`l-${i}`} style={{ width: 14 }} />;
          }
          return (
            <View
              key={`l-${i}`}
              style={{ flex: flexValues[i] }}
              className="items-center"
            >
              <Text
                className="text-[9px] text-text-mute"
                style={{ fontFamily: 'Sora_700Bold', letterSpacing: 1 }}
              >
                {label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start }, (_, i) => start + i);
}

function WheelColumn({
  flex,
  values,
  selected,
  format,
  onPick,
}: {
  flex: number;
  values: number[];
  selected: number;
  format: (v: number) => string;
  onPick: (v: number) => void;
}) {
  const idx = values.indexOf(selected);
  return (
    <View style={{ flex, alignItems: 'center', justifyContent: 'center' }}>
      {VISIBLE_OFFSETS.map((offset) => {
        const wrapped = wrap(values, idx + offset);
        const isSelected = offset === 0;
        return (
          <Pressable
            key={`r-${offset}`}
            onPress={isSelected ? undefined : () => onPick(wrapped)}
            disabled={isSelected}
            style={{
              height: ROW_HEIGHT,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              className={cn('text-text', isSelected ? 'text-base' : 'text-sm')}
              style={{
                fontFamily: isSelected
                  ? 'JetBrainsMono_700Bold'
                  : 'JetBrainsMono_500Medium',
                opacity: opacityFor(offset),
              }}
            >
              {format(wrapped)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function wrap(values: number[], idx: number): number {
  const n = values.length;
  const safe = ((idx % n) + n) % n;
  return values[safe];
}

function opacityFor(offset: number): number {
  if (offset === 0) return 1;
  if (Math.abs(offset) === 1) return 0.5;
  return 0.22;
}
