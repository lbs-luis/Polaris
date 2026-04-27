import { LayoutBottomSheet } from '@/components/layout/bottom-sheet.layout';
import { DrawerButton } from '@/components/ui/drawer-button';
import { Select } from '@/components/ui/select';
import { ICategoriesTRow } from '@/database/tables/categories.table';
import { useRecurrentsTable } from '@/database/tables/recurrents.table';
import { useKeyboardOffset } from '@/hooks/keyboard/use-keyboard-offset';
import { formatCurrency, parseCurrency } from '@/libs/masks';
import { cn } from '@/libs/utils';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

interface RecurrenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => Promise<void>;
  day: number | null;
  categories: ICategoriesTRow[];
}

export function RecurrenceDrawer({
  isOpen,
  onClose,
  onSaved,
  day,
  categories,
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
    if (!day || !selectedCategory) return;
    setIsSaving(true);
    await set({
      base_value: parseCurrency(baseValue) * 100, // saving in cents
      category_id: Number(selectedCategory),
      due_day: day,
      type: 'income',
    });
    setIsSaving(false);
    await onSaved();
    onClose();
  }

  function handleChangeBaseValue(text: string) {
    const formatted = formatCurrency(text);
    setBaseValue(formatted);
  }

  return (
    <LayoutBottomSheet isOpen={isOpen} onClose={onClose}>
      <View className="p-4" style={{ paddingBottom: keyboardHeight + 32 }}>
        <View className="w-full flex-row items-center justify-between">
          <Text
            className="text-xl font-medium text-text-primary"
            style={{ textTransform: 'uppercase', flexShrink: 0 }}
          >
            {`Dia ${day}`}
          </Text>
          <Text
            className="text-sm font-medium text-text-secondary/60"
            style={{ textTransform: 'uppercase', flexShrink: 0 }}
          >
            Novo Lançamento
          </Text>
        </View>
        <View className="mt-4 flex w-full flex-col gap-2">
          <Text className="text-base font-medium text-text-primary">Valor</Text>
          <BottomSheetTextInput
            value={baseValue}
            onChangeText={handleChangeBaseValue}
            editable={!isSaving}
            placeholder="Uber, Assinaturas, Streamings, ..."
            className={cn(
              'w-full rounded-lg bg-input-primary p-4 text-base font-normal text-text-primary',
              ' placeholder:text-text-secondary/50',
              isSaving ? 'opacity-50' : 'opacity-100'
            )}
            keyboardType="numeric"
          />
        </View>
        <View className="mt-4 flex w-full flex-col gap-2">
          <Text className="text-base font-medium text-text-primary">
            Categoria
          </Text>
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
          disabled={isSaving}
          onPress={handleSave}
          className={isSaving ? 'opacity-50' : 'opacity-100'}
        />
      </View>
    </LayoutBottomSheet>
  );
}
