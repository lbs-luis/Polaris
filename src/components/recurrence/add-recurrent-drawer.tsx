import { DayPickerModal } from '@/components/recurrence/day-picker-modal';
import { Button } from '@/components/ui/button';
import { CategorySelect } from '@/components/ui/category/select.category';
import { Label } from '@/components/ui/label';
import { ICategoriesTRow } from '@/database/tables/categories.table';
import {
  IRecurrentsTRow,
  useRecurrentsTable,
} from '@/database/tables/recurrents.table';
import { useKeyboardOffset } from '@/hooks/keyboard/use-keyboard-offset';
import { formatCurrency, parseCurrency } from '@/libs/masks';
import { cn } from '@/libs/utils';
import { CalendarDotsIcon } from 'phosphor-react-native';
import { useMemo, useState } from 'react';
import { Keyboard, Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AddRecurrentDrawerProps {
  type: 'income' | 'outcome';
  categories: ICategoriesTRow[];
  /** All recurrents of the same type — used by the day-picker calendar to
   *  show which days already have entries. */
  registries: IRecurrentsTRow[];
  recurrent?: IRecurrentsTRow;
  onSaved: () => void;
}

/**
 * Drawer body used by the /recurrents route to create or edit a recurrent.
 * Unlike the onboarding flow (calendar → form), this form owns the day
 * selection internally — the user fills value + category + day all in one
 * place, with the day picker opening as a full-screen modal on demand.
 */
export function AddRecurrentDrawer({
  type,
  categories,
  registries,
  recurrent,
  onSaved,
}: AddRecurrentDrawerProps) {
  const keyboardHeight = useKeyboardOffset();
  const insets = useSafeAreaInsets();
  const { set, update } = useRecurrentsTable();

  const initialCategory = recurrent
    ? categories.find((c) => c.id === recurrent.category_id)
    : undefined;

  const [day, setDay] = useState<number | null>(recurrent?.due_day ?? null);
  const [baseValue, setBaseValue] = useState(
    recurrent ? formatCurrency(recurrent.base_value.toString()) : ''
  );
  const [selectedCategory, setSelectedCategory] = useState<
    ICategoriesTRow | undefined
  >(initialCategory);
  const [isSaving, setIsSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const isDisabled = !day || !selectedCategory || !baseValue.trim() || isSaving;

  async function handleSave() {
    if (isDisabled || !day || !selectedCategory) return;
    Keyboard.dismiss();
    setIsSaving(true);

    const payload = {
      base_value: Math.round(parseCurrency(baseValue) * 100),
      category_id: selectedCategory.id,
      due_day: day,
      type,
      concluded: recurrent?.concluded ?? 0,
    };

    if (recurrent) {
      await update(recurrent.id, payload);
    } else {
      await set(payload);
    }

    setIsSaving(false);
    onSaved();
  }

  const paddingBottom = useMemo(
    () => keyboardHeight + 16 + insets.bottom,
    [keyboardHeight, insets.bottom]
  );

  const accentBorder = type === 'income' ? 'border-income' : 'border-outcome';

  return (
    <View className="px-6 pt-2" style={{ paddingBottom }}>
      <Label label="Valor" uppercase={false} />
      <View
        className={cn(
          'mt-2 flex-row items-center rounded-tile border-[1.5px] bg-surface-2 px-4 py-3',
          accentBorder,
          isSaving && 'opacity-50'
        )}
      >
        <TextInput
          value={baseValue}
          onChangeText={(text) => setBaseValue(formatCurrency(text))}
          editable={!isSaving}
          placeholder="R$ 0,00"
          placeholderTextColor="#5E5E66"
          keyboardType="numeric"
          style={{
            flex: 1,
            fontFamily: 'JetBrainsMono_700Bold',
            fontSize: 26,
            color: '#FFFFFF',
            letterSpacing: -0.5,
            paddingVertical: 4,
          }}
        />
      </View>

      <View className="mt-5">
        <Label label="Categoria" uppercase={false} />
        <View className="mt-2">
          <CategorySelect
            list={categories}
            onSelect={setSelectedCategory}
            selected={selectedCategory}
          />
        </View>
      </View>

      <View className="mt-5">
        <Label label="Dia do mês" uppercase={false} />
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
            setPickerOpen(true);
          }}
          disabled={isSaving}
          className={cn(
            'mt-2 h-14 flex-row items-center justify-between rounded-tile border border-border bg-surface-2 px-4',
            isSaving && 'opacity-50'
          )}
        >
          <Text
            className={cn('text-base', day ? 'text-text' : 'text-text-dim')}
            style={{ fontFamily: 'Sora_600SemiBold' }}
          >
            {day ? `Todo dia ${day}` : 'Selecione um dia'}
          </Text>
          <CalendarDotsIcon size={20} color="#9A9AA2" weight="bold" />
        </Pressable>
      </View>

      <Button
        text={recurrent ? 'Atualizar' : 'Salvar'}
        disabled={isDisabled}
        onPress={handleSave}
        className={cn('mt-6', isDisabled && 'opacity-50')}
      />

      <DayPickerModal
        visible={pickerOpen}
        type={type}
        registries={registries}
        onSelectDay={(picked) => {
          setDay(picked);
          setPickerOpen(false);
        }}
        onClose={() => setPickerOpen(false)}
      />
    </View>
  );
}
