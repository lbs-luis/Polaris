import { LayoutBottomSheet } from '@/components/layout/bottom-sheet.layout';
import { DrawerButton } from '@/components/ui/drawer-button';
import { Input } from '@/components/ui/input';
import { useCategoriesTable } from '@/database/tables/categories.table';
import { useKeyboardOffset } from '@/hooks/keyboard/use-keyboard-offset';
import { cn } from '@/libs/utils';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { StepLabel } from '../step-label';
import { CategoryTypeButton } from './category-type-button';

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  defaultSelected: 'income' | 'outcome';
}

export function CategoryDrawer({
  isOpen,
  onClose,
  onSaved,
  defaultSelected,
}: CategoryDrawerProps) {
  const { set } = useCategoriesTable();
  const keyboardHeight = useKeyboardOffset();

  const [category, setCategory] = useState('');
  const [categoryType, setCategoryType] = useState<'income' | 'outcome'>(
    defaultSelected
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setCategoryType(defaultSelected);
  }, [defaultSelected]);

  async function handleSave() {
    if (category.length <= 1 || isSaving) return;
    setIsSaving(true);
    await set({ name: category, type: categoryType });
    setCategory('');
    setIsSaving(false);
    onSaved?.();
    onClose();
  }

  return (
    <LayoutBottomSheet isOpen={isOpen} onClose={onClose}>
      <View
        className="px-6 pt-4"
        style={{ paddingBottom: keyboardHeight + 16 }}
      >
        <StepLabel
          label="Nova Categoria"
          className="text-xl text-text-primary"
          uppercase={false}
        />
        <Input
          value={category}
          onChangeText={setCategory}
          editable={!isSaving}
          placeholder="Ex.:  salário,  aluguel..."
          className={cn('mt-6', isSaving ? 'opacity-50' : 'opacity-100')}
        />
        <View className="mt-6 flex w-full flex-row gap-2 rounded-xl bg-input-primary p-2">
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
          text="salvar"
          disabled={category.length <= 1 || isSaving}
          onPress={handleSave}
          className={cn(
            'mt-6',
            category.length <= 1 || isSaving ? 'opacity-50' : 'opacity-100'
          )}
        />
      </View>
    </LayoutBottomSheet>
  );
}
