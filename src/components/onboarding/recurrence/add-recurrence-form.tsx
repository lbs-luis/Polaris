import { Button } from '@/components/ui/button';
import { CategorySelect } from '@/components/ui/category/select.category';
import { ICategoriesTRow } from '@/database/tables/categories.table';
import {
  IRecurrentsTRow,
  useRecurrentsTable,
} from '@/database/tables/recurrents.table';
import { useKeyboardOffset } from '@/hooks/keyboard/use-keyboard-offset';
import { formatCurrency, parseCurrency } from '@/libs/masks';
import { cn } from '@/libs/utils';
import { useMemo, useState } from 'react';
import { Keyboard, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Label } from '../../ui/label';

interface AddRecurrenceFormProps {
  onSaved: () => void;
  day: number | null;
  categories: ICategoriesTRow[];
  type: 'income' | 'outcome';
  recurrent?: IRecurrentsTRow;
}

export function AddRecurrenceForm({
  onSaved,
  day,
  categories,
  type,
  recurrent,
}: AddRecurrenceFormProps) {
  const keyboardHeight = useKeyboardOffset();
  const insets = useSafeAreaInsets();
  const { set, update } = useRecurrentsTable();

  const initialCategory = recurrent
    ? categories.find((c) => c.id === recurrent.category_id)
    : undefined;

  const [baseValue, setBaseValue] = useState(
    recurrent ? formatCurrency(recurrent.base_value.toString()) : ''
  );
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    ICategoriesTRow | undefined
  >(initialCategory);

  const isDisabled = !day || !selectedCategory || !baseValue.trim() || isSaving;

  async function handleSave() {
    if (isDisabled || !day || !selectedCategory) return;
    Keyboard.dismiss();
    setIsSaving(true);

    const payload = {
      base_value: parseCurrency(baseValue) * 100,
      category_id: selectedCategory.id,
      due_day: day,
      type,
    };

    if (recurrent) {
      await update(recurrent.id, payload);
    } else {
      await set(payload);
    }

    setIsSaving(false);
    onSaved();
  }

  function handleChangeBaseValue(text: string) {
    setBaseValue(formatCurrency(text));
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
          onChangeText={handleChangeBaseValue}
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

      <View className="mt-5 flex w-full flex-col gap-2">
        <Label label="Categoria" uppercase={false} />
        <CategorySelect
          list={categories}
          onSelect={setSelectedCategory}
          selected={selectedCategory}
        />
      </View>

      <Button
        text={recurrent ? 'Atualizar' : 'Salvar'}
        disabled={isDisabled}
        onPress={handleSave}
        className={cn('mt-6', isDisabled && 'opacity-50')}
      />
    </View>
  );
}
