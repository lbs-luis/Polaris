import { RecurrencyCalendar } from '@/components/onboarding/recurrence/recurrency-calendar';
import { IRecurrentsTRow } from '@/database/tables/recurrents.table';
import { XIcon } from 'phosphor-react-native';
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
  onSelectDay: (day: number) => void;
  onClose: () => void;
}

/**
 * Full-screen modal that shows the existing `RecurrencyCalendar`. Used by
 * the add/edit-recurrency drawer so the day picker can be opened from
 * inside the form without losing the form state. Dismisses by tapping the
 * close icon, the backdrop, or selecting any day.
 */
export function DayPickerModal({
  visible,
  type,
  registries,
  onSelectDay,
  onClose,
}: DayPickerModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <SafeAreaView className="flex-1 items-center justify-center bg-black/60 px-5">
          <TouchableWithoutFeedback>
            <View
              className="w-full rounded-card border border-border-subtle bg-surface-2  p-5"
              style={{ maxWidth: 480 }}
            >
              <View className="mb-3 flex-row items-center justify-between">
                <Text
                  className="text-base text-text"
                  style={{ fontFamily: 'Sora_700Bold' }}
                >
                  Selecione um dia
                </Text>
                <Pressable
                  onPress={onClose}
                  hitSlop={12}
                  className="h-8 w-8 items-center justify-center"
                >
                  <XIcon size={18} color="#9A9AA2" weight="bold" />
                </Pressable>
              </View>
              <RecurrencyCalendar
                type={type}
                isLoading={false}
                registries={registries}
                onSelectDay={(day) => onSelectDay(day)}
              />
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
