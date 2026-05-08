import { OnboardingBody } from '@/components/layout/onboarding/onboarding-body.layout';
import { AddCategoryBadge } from '@/components/onboarding/category/add-category-badge';
import { CategoryBadge } from '@/components/onboarding/category/category-badge';
import { CategoryDrawer } from '@/components/onboarding/category/category-drawer';
import { StepConfirmButton } from '@/components/onboarding/step-confirm-button';
import { StepHeader } from '@/components/onboarding/step-header';
import { StepLabel } from '@/components/onboarding/step-label';
import {
  ICategoriesTRow,
  useCategoriesTable,
} from '@/database/tables/categories.table';
import { IRenderStepProps } from '@/interfaces/onboarding.types';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

export default function CategoryStep({ onNextStep }: IRenderStepProps) {
  const { list, exclude } = useCategoriesTable();

  const [categoryList, setCategoryList] = useState<ICategoriesTRow[]>([]);

  const [modalOptions, setModalOptions] = useState<{
    isOpen: boolean;
    defaultSelected: 'income' | 'outcome';
  }>({ isOpen: false, defaultSelected: 'income' });

  const updateCategoriesList = useCallback(async () => {
    const newCategoriesList = await list();
    setCategoryList(newCategoriesList);
  }, [list]);

  useEffect(() => {
    updateCategoriesList();
  }, [updateCategoriesList]);

  async function handleDeleteCategory(name: string) {
    await exclude(name);
  }

  return (
    <OnboardingBody className="px-6 pb-4">
      <StepHeader
        title={`Suas\ncategorias.`}
        description="Organize como preferir."
      />
      <ScrollView className="mt-8 flex flex-1 flex-col pb-4">
        <View className=" flex w-full flex-col gap-4">
          <StepLabel label="Entradas" />
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
                setModalOptions({ isOpen: true, defaultSelected: 'income' })
              }
            />
          </View>
        </View>
        <View className="mt-6 flex w-full flex-col gap-4">
          <StepLabel label="Saídas" />
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
                setModalOptions({ isOpen: true, defaultSelected: 'outcome' })
              }
            />
          </View>
        </View>
      </ScrollView>

      <StepConfirmButton onNextStep={onNextStep} />
      <CategoryDrawer
        isOpen={modalOptions.isOpen}
        defaultSelected={modalOptions.defaultSelected}
        onClose={() =>
          setModalOptions({ isOpen: false, defaultSelected: 'income' })
        }
        onSaved={() => updateCategoriesList()}
      />
    </OnboardingBody>
  );
}
