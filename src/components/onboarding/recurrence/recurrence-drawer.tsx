import { LayoutBottomSheet } from '@/components/layout/bottom-sheet.layout';
import { Select } from '@/components/ui/select';
import {
  ICategoriesTRow,
  useCategoriesTable,
} from '@/database/tables/categories.table';
import { useKeyboardOffset } from '@/hooks/keyboard/use-keyboard-offset';
import { cn } from '@/libs/utils';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

interface RecurrenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  day: number | null;
}

export function RecurrenceDrawer({
  isOpen,
  onClose,
  onSaved,
  day,
}: RecurrenceDrawerProps) {
  const { list } = useCategoriesTable();
  const keyboardHeight = useKeyboardOffset();

  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<ICategoriesTRow[] | null>(null);

  useEffect(() => {
    async function getCategories() {
      const categoriesList = await list('income');
      setCategories(categoriesList);
    }

    getCategories();
  }, [list]);

  return (
    <LayoutBottomSheet isOpen={isOpen} onClose={onClose}>
      <View className="p-4" style={{ paddingBottom: keyboardHeight + 16 }}>
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
            value={description}
            onChangeText={setDescription}
            editable={!isSaving}
            placeholder="Uber, Assinaturas, Streamings, ..."
            className={cn(
              'w-full rounded-lg bg-input-primary p-4 text-base font-normal text-text-primary',
              ' placeholder:text-text-secondary/50',
              isSaving ? 'opacity-50' : 'opacity-100'
            )}
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
            />
          )}
        </View>
      </View>
    </LayoutBottomSheet>
  );
}
