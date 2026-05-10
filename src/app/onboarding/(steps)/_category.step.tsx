import { DismissKeyboardView } from '@/components/layout/dismiss-keyboard-view.layout';
import { AddCategoryBadge } from '@/components/onboarding/category/add-category-badge';
import { AddCategoryForm } from '@/components/onboarding/category/add-category-form';
import { CategoryBadge } from '@/components/onboarding/category/category-badge';

import { StepHeader } from '@/components/onboarding/step-header';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useBottomSheetContext } from '@/context/bottomsheet.context';
import {
  ICategoriesTRow,
  useCategoriesTable,
} from '@/database/tables/categories.table';
import { IRenderStepProps } from '@/interfaces/onboarding.types';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

export default function CategoryStep({ onNextStep }: IRenderStepProps) {
  const { list, exclude } = useCategoriesTable();
  const { openBottomSheet } = useBottomSheetContext();
  const [categoryList, setCategoryList] = useState<ICategoriesTRow[]>([]);

  const updateCategoriesList = useCallback(async () => {
    setCategoryList(await list());
  }, [list]);

  useEffect(() => {
    updateCategoriesList();
  }, [updateCategoriesList]);

  async function handleDeleteCategory(name: string) {
    await exclude(name);
  }

  return (
    <DismissKeyboardView className="px-6 pb-4">
      <StepHeader
        title={`Suas\ncategorias.`}
        description="Organize como preferir."
      />
      <ScrollView className="mt-8 flex flex-1 flex-col pb-4">
        <View className=" flex w-full flex-col gap-4">
          <Label label="Entradas" />
          <View className="flex w-full flex-row flex-wrap gap-2">
            {categoryList
              .filter((item) => item.type === 'income')
              .map((item) => (
                <CategoryBadge
                  label={item.name}
                  key={item.id}
                  isDefault={item.isDefault}
                  onDelete={() => handleDeleteCategory(item.name)}
                />
              ))}
            <AddCategoryBadge
              onPress={() =>
                openBottomSheet(
                  <AddCategoryForm
                    defaultSelected="income"
                    onSaved={updateCategoriesList}
                  />
                )
              }
            />
          </View>
        </View>
        <View className="mt-6 flex w-full flex-col gap-4">
          <Label label="Saídas" />
          <View className="flex w-full flex-row flex-wrap gap-2">
            {categoryList
              .filter((item) => item.type === 'outcome')
              .map((item) => (
                <CategoryBadge
                  label={item.name}
                  key={item.id}
                  isDefault={item.isDefault}
                  onDelete={() => handleDeleteCategory(item.name)}
                />
              ))}
            <AddCategoryBadge
              onPress={() =>
                openBottomSheet(
                  <AddCategoryForm
                    defaultSelected="outcome"
                    onSaved={updateCategoriesList}
                  />
                )
              }
            />
          </View>
        </View>
      </ScrollView>

      <Button onPress={onNextStep} className="mt-auto" text="Continuar" />
    </DismissKeyboardView>
  );
}
