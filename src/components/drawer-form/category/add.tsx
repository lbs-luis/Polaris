import { Button } from '@/components/ui/button';
import { CatKind, isCatKind } from '@/components/ui/cat-icon';
import { IconPicker } from '@/components/ui/category/icon-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SegItem } from '@/components/ui/seg-item';
import {
  ICategoriesTRow,
  useCategoriesTable,
} from '@/database/tables/categories.table';
import { useKeyboardOffset } from '@/hooks/keyboard/use-keyboard-offset';
import { cn } from '@/libs/utils';
import { ArrowDownIcon, ArrowUpIcon } from 'phosphor-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AddCategoryFormProps {
  onSaved: () => Promise<void>;
  defaultSelected: 'income' | 'outcome';
  category?: ICategoriesTRow;
}

/**
 * Drawer body for creating or editing a category. Used today by the
 * onboarding category step; lives in `drawer-form/` so any future screen
 * (e.g., a settings/manage-categories page) can mount the same form
 * without dragging in onboarding-specific dependencies.
 */
export function AddCategoryForm({
  onSaved,
  defaultSelected,
  category: editing,
}: AddCategoryFormProps) {
  const { set, update } = useCategoriesTable();
  const keyboardHeight = useKeyboardOffset();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState(editing?.name ?? '');
  const [categoryType, setCategoryType] = useState<'income' | 'outcome'>(
    editing?.type ?? defaultSelected
  );
  const [icon, setIcon] = useState<CatKind | null>(
    isCatKind(editing?.icon) ? (editing!.icon as CatKind) : null
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!editing) setCategoryType(defaultSelected);
  }, [defaultSelected, editing]);

  const isDisabled = name.trim().length <= 1 || !icon || isSaving;

  async function handleSave() {
    if (isDisabled || !icon) return;
    setIsSaving(true);
    const payload = { name: name.trim(), type: categoryType, icon };
    if (editing) {
      await update(editing.id, payload);
    } else {
      await set(payload);
    }
    setName('');
    setIcon(null);
    setIsSaving(false);
    Keyboard.dismiss();
    await onSaved();
  }

  const paddingBottom = useMemo(
    () => keyboardHeight + 16 + insets.bottom,
    [keyboardHeight, insets.bottom]
  );

  return (
    <View className="px-6 pt-2" style={{ paddingBottom }}>
      <Label label="Tipo" uppercase={false} />
      <View className="mt-2 flex-row gap-2">
        <SegItem
          icon={ArrowDownIcon}
          label="Entrada"
          tone="income"
          active={categoryType === 'income'}
          onPress={() => setCategoryType('income')}
        />
        <SegItem
          icon={ArrowUpIcon}
          label="Saída"
          tone="outcome"
          active={categoryType === 'outcome'}
          onPress={() => setCategoryType('outcome')}
        />
      </View>

      <View className="mt-5">
        <Input
          label="Nome da categoria"
          value={name}
          onChangeText={setName}
          editable={!isSaving}
          placeholder="Ex.: salário, aluguel..."
          className={cn(isSaving && 'opacity-50')}
        />
      </View>

      <View className="mt-5">
        <IconPicker value={icon} onChange={setIcon} />
      </View>

      <Button
        text={editing ? 'Atualizar' : 'Adicionar'}
        disabled={isDisabled}
        onPress={handleSave}
        className={cn('mt-6', isDisabled && 'opacity-50')}
      />
    </View>
  );
}
