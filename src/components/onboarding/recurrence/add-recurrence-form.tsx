import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ICategoriesTRow } from '@/database/tables/categories.table';
import { useRecurrentsTable } from '@/database/tables/recurrents.table';
import { useKeyboardOffset } from '@/hooks/keyboard/use-keyboard-offset';
import { formatCurrency, parseCurrency } from '@/libs/masks';
import { cn } from '@/libs/utils';
import { useMemo, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StepLabel } from '../step-label';

interface AddRecurrenceFormProps {
  onSaved: () => Promise<void>;
  day: number | null;
  categories: ICategoriesTRow[];
  type: 'income' | 'outcome';
}

export function AddRecurrenceForm({
  onSaved,
  day,
  categories,
  type,
}: AddRecurrenceFormProps) {
  const keyboardHeight = useKeyboardOffset();
  const insets = useSafeAreaInsets();
  const { set } = useRecurrentsTable();
  const [baseValue, setBaseValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );

  function resetForm() {
    setBaseValue('');
    setSelectedCategory(undefined);
  }

  async function handleSave() {
    if (!day || !selectedCategory || isSaving) return;
    setIsSaving(true);
    Keyboard.dismiss();
    await set({
      base_value: parseCurrency(baseValue) * 100,
      category_id: Number(selectedCategory),
      due_day: day,
      type,
    });
    setIsSaving(false);
    resetForm();
    onSaved();
  }

  function handleChangeBaseValue(text: string) {
    const formatted = formatCurrency(text);
    setBaseValue(formatted);
  }

  const canSave = !day || !selectedCategory || isSaving;

  const paddingBottom = useMemo(
    () => keyboardHeight + 16 + insets.bottom,
    [keyboardHeight, insets.bottom]
  );

  return (
    <View className="px-6 pt-2" style={{ paddingBottom }}>
      <View className="w-full flex-row items-center justify-between">
        <StepLabel
          label={`dia ${day}`}
          className="text-xl text-text-primary"
          uppercase={false}
          style={{ fontFamily: 'Sora_400Regular' }}
        />
      </View>
      <Input
        label="Valor"
        value={baseValue}
        onChangeText={handleChangeBaseValue}
        editable={!isSaving}
        placeholder="R$ 0,00"
        className={cn('mt-6', isSaving ? 'opacity-50' : 'opacity-100')}
        keyboardType="numeric"
      />
      <View className="mt-6 flex w-full flex-col gap-2">
        <StepLabel label="Categoria" uppercase={false} />
        {categories && (
          <Select
            options={categories.map((category) => ({
              label: category.name,
              value: category.id.toString(),
            }))}
            onChange={setSelectedCategory}
          />
        )}
      </View>
      <Button
        text="Salvar"
        disabled={canSave}
        onPress={handleSave}
        className="mt-6"
      />
    </View>
  );
}
