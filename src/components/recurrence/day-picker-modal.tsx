import { CalendarPicker } from '@/components/recurrence/calendar-picker';
import { Button } from '@/components/ui/button';
import { GhostButton } from '@/components/ui/ghost-button';
import { IRecurrentsTRow } from '@/database/tables/recurrents.table';
import { XIcon } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DayPickerModalProps {
  visible: boolean;
  type: 'income' | 'outcome';
  registries: IRecurrentsTRow[];
  /** Day to pre-highlight when the modal opens. */
  initial?: number;
  onSelectDay: (day: number) => void;
  onClose: () => void;
}

/**
 * Centered card modal for picking a recurrent's day-of-month. Faithful to
 * the design's `CalendarPicker` overlay — header + close X, helper line,
 * calendar inside a rounded inner panel, and `Cancelar` / `Confirmar dia X`
 * CTAs at the bottom.
 *
 * The user can tap multiple days; only `Confirmar` emits the choice
 * (the previous "tap = commit" behavior was confusing because there was
 * no way to cancel after an accidental tap).
 */
export function DayPickerModal({
  visible,
  type,
  registries,
  initial,
  onSelectDay,
  onClose,
}: DayPickerModalProps) {
  const [picked, setPicked] = useState<number | null>(initial ?? null);

  // Reset the local selection every time the modal opens so the form's
  // current day is reflected instead of the previously-picked one.
  useEffect(() => {
    if (visible) setPicked(initial ?? null);
  }, [visible, initial]);

  const occupiedDays = registries.map((r) => r.due_day);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <SafeAreaView className="flex-1 items-center justify-center bg-black/70 px-4">
          <TouchableWithoutFeedback>
            <View
              className="w-full rounded-sheet border border-border-subtle bg-surface p-5"
              style={{ maxWidth: 480 }}
            >
              <View className="flex-row items-center justify-between">
                <Text
                  className="text-base text-text"
                  style={{ fontFamily: 'Sora_700Bold' }}
                >
                  Escolha o dia
                </Text>
                <Pressable
                  onPress={onClose}
                  hitSlop={12}
                  className="h-8 w-8 items-center justify-center rounded-full bg-surface-2"
                >
                  <XIcon size={16} color="#FFFFFF" weight="bold" />
                </Pressable>
              </View>

              <Text
                className="mt-1 text-xs text-text-dim"
                style={{ fontFamily: 'Sora_400Regular' }}
              >
                A recorrência será cobrada todo mês neste dia.
              </Text>

              <View className="mt-4">
                <CalendarPicker
                  selected={picked}
                  occupiedDays={occupiedDays}
                  occupiedTone={type}
                  onSelect={setPicked}
                />
              </View>

              <View className="mt-5 flex-row gap-2.5">
                <View className="flex-1">
                  <GhostButton onPress={onClose}>
                    <Text
                      className="text-base text-text"
                      style={{ fontFamily: 'Sora_600SemiBold' }}
                    >
                      Cancelar
                    </Text>
                  </GhostButton>
                </View>
                <View className="flex-[2]">
                  <Button
                    disabled={picked === null}
                    onPress={() => picked !== null && onSelectDay(picked)}
                    text={
                      picked !== null
                        ? `Confirmar dia ${picked}`
                        : 'Selecione um dia'
                    }
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
