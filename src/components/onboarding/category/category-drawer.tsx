import { LayoutBottomSheet } from '@/components/layout/bottom-sheet.layout';
import { DrawerButton } from '@/components/ui/drawer-button';
import { useCategoriesTable } from '@/database/tables/categories.table';
import { useKeyboardOffset } from '@/hooks/keyboard/use-keyboard-offset';
import { cn } from '@/libs/utils';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { CategoryTypeButton } from './category-type-button';

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function CategoryDrawer({
  isOpen,
  onClose,
  onSaved,
}: CategoryDrawerProps) {
  const { set } = useCategoriesTable();
  const keyboardHeight = useKeyboardOffset();

  const [category, setCategory] = useState('');
  const [categoryType, setCategoryType] = useState<'income' | 'outcome'>(
    'outcome'
  );
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (category.length <= 1 || isSaving) return;
    setIsSaving(true);
    await set({ name: category, type: categoryType });
    setCategory('');
    setCategoryType('outcome');
    setIsSaving(false);
    onSaved?.();
    onClose();
  }

  return (
    <LayoutBottomSheet isOpen={isOpen} onClose={onClose}>
      <View className="p-4" style={{ paddingBottom: keyboardHeight + 32 }}>
        <Text className="text-xl font-medium text-text-secondary">
          Nova Categoria
        </Text>
        <BottomSheetTextInput
          value={category}
          onChangeText={setCategory}
          editable={!isSaving}
          placeholder="Uber, Assinaturas, Streamings, ..."
          className={cn(
            'mt-4 w-full rounded-lg bg-input-primary p-4 text-base font-normal text-text-primary',
            ' placeholder:text-text-secondary/50',
            isSaving ? 'opacity-50' : 'opacity-100'
          )}
        />
        <View className="mt-4 flex w-full flex-row gap-2 rounded-xl bg-input-primary p-2">
          <CategoryTypeButton
            selected={categoryType === 'income'}
            onSelect={() => setCategoryType('income')}
          >
            Receita
          </CategoryTypeButton>
          <CategoryTypeButton
            selected={categoryType === 'outcome'}
            onSelect={() => setCategoryType('outcome')}
          >
            Despesa
          </CategoryTypeButton>
        </View>
        <DrawerButton
          text="adicionar nova categoria"
          disabled={category.length <= 1 || isSaving}
          onPress={handleSave}
          className={
            category.length <= 1 || isSaving ? 'opacity-50' : 'opacity-100'
          }
        />
      </View>
    </LayoutBottomSheet>
  );
}
