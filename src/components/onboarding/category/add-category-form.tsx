import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCategoriesTable } from '@/database/tables/categories.table';
import { useKeyboardOffset } from '@/hooks/keyboard/use-keyboard-offset';
import { cn } from '@/libs/utils';
import { useEffect, useMemo, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StepLabel } from '../step-label';
import { CategoryTypeButton } from './category-type-button';

interface AddCategoryFormProps {
  onSaved: () => Promise<void>;
  defaultSelected: 'income' | 'outcome';
}

export function AddCategoryForm({
  onSaved,
  defaultSelected,
}: AddCategoryFormProps) {
  const { set } = useCategoriesTable();
  const keyboardHeight = useKeyboardOffset();
  const insets = useSafeAreaInsets();
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
    Keyboard.dismiss();
    onSaved();
  }

  const paddingBottom = useMemo(
    () => keyboardHeight + 16 + insets.bottom,
    [keyboardHeight, insets.bottom]
  );

  return (
    <View className="px-6 pt-4" style={{ paddingBottom }}>
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
      <Button
        text="Salvar"
        disabled={category.length <= 1 || isSaving}
        onPress={handleSave}
        className={cn(
          'mt-6',
          category.length <= 1 || isSaving ? 'opacity-50' : 'opacity-100'
        )}
      />
    </View>
  );
}
