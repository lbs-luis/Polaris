import { LayoutBottomSheet } from '@/components/layout/bottom-sheet.layout';
import { DrawerButton } from '@/components/ui/drawer-button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ICategoriesTRow } from '@/database/tables/categories.table';
import { useRecurrentsTable } from '@/database/tables/recurrents.table';
import { useKeyboardOffset } from '@/hooks/keyboard/use-keyboard-offset';
import { formatCurrency, parseCurrency } from '@/libs/masks';
import { cn } from '@/libs/utils';
import { useEffect, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { StepLabel } from '../step-label';

interface RecurrenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => Promise<void>;
  day: number | null;
  categories: ICategoriesTRow[];
  type: 'income' | 'outcome';
}

export function RecurrenceDrawer({
  isOpen,
  onClose,
  onSaved,
  day,
  categories,
  type,
}: RecurrenceDrawerProps) {
  const keyboardHeight = useKeyboardOffset();
  const { set } = useRecurrentsTable();
  const [baseValue, setBaseValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (!isOpen) {
      setBaseValue('');
      setSelectedCategory(undefined);
    }
  }, [isOpen]);

  async function handleSave() {
    if (!day || !selectedCategory || isSaving) return;
    setIsSaving(true);
    await set({
      base_value: parseCurrency(baseValue) * 100,
      category_id: Number(selectedCategory),
      due_day: day,
      type,
    });
    setIsSaving(false);
    await onSaved();
    Keyboard.dismiss();
    setTimeout(() => {
      onClose();
    }, 150);
  }

  function handleChangeBaseValue(text: string) {
    const formatted = formatCurrency(text);
    setBaseValue(formatted);
  }

  const canSave = !day || !selectedCategory || isSaving;

  return (
    <LayoutBottomSheet isOpen={isOpen} onClose={onClose}>
      <View
        className="px-6 pt-4"
        style={{ paddingBottom: keyboardHeight + 16 }}
      >
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
        <DrawerButton
          text="salvar"
          disabled={canSave}
          onPress={handleSave}
          className={cn('mt-6', canSave ? 'opacity-50' : 'opacity-100')}
        />
      </View>
    </LayoutBottomSheet>
  );
}
