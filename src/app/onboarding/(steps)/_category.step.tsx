import { CategoryDrawer } from '@/components/onboarding/category/category-drawer';
import { StepConfirmButton } from '@/components/onboarding/step-confirm-button';
import { StepHeader } from '@/components/onboarding/step-header';
import {
  ICategoriesTRow,
  useCategoriesTable,
} from '@/database/tables/categories.table';
import { IRenderStepProps } from '@/interfaces/onboarding.types';
import { Plus, X } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const CategoryBadge = ({
  label,
  onDelete,
}: {
  label: string;
  onDelete: () => Promise<void>;
}) => (
  <View className="flex flex-row items-center justify-center gap-3 self-start rounded-xl bg-surface-secondary px-5 py-3">
    <Text className="text-xl font-normal text-text-primary">{label}</Text>
    <TouchableWithoutFeedback onPress={onDelete}>
      <X size={16} color="#ffffff" />
    </TouchableWithoutFeedback>
  </View>
);

export default function CategoryStep({ onNextStep }: IRenderStepProps) {
  const { list, exclude } = useCategoriesTable();

  const [categoryList, setCategoryList] = useState<ICategoriesTRow[]>([]);

  const [isOpen, setIsOpen] = useState<boolean>(false);

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
    <>
      <StepHeader
        title="Categoria"
        description="Organize suas receitas e despesas."
      />
      <ScrollView className="mt-8 flex flex-1 flex-col pb-4">
        <View className=" flex w-full flex-col gap-4">
          <View className="flex self-start">
            <Text className="border-b border-text-secondary pb-2 pr-1 text-lg font-normal uppercase text-text-secondary">
              receitas
            </Text>
          </View>
          <View className="flex w-full flex-row flex-wrap gap-2">
            {categoryList
              .filter((item) => item.type === 'income')
              .map((item) => (
                <CategoryBadge
                  label={item.name}
                  key={item.id}
                  onDelete={() => handleDeleteCategory(item.name)}
                />
              ))}
          </View>
        </View>
        <View className="mt-6 flex w-full flex-col gap-4">
          <View className="flex self-start">
            <Text className="border-b border-text-secondary pb-2 pr-1 text-lg font-normal uppercase text-text-secondary">
              despesas
            </Text>
          </View>
          <View className="flex w-full flex-row flex-wrap gap-2">
            {categoryList
              .filter((item) => item.type === 'outcome')
              .map((item) => (
                <CategoryBadge
                  label={item.name}
                  key={item.id}
                  onDelete={() => handleDeleteCategory(item.name)}
                />
              ))}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        className="mx-auto mb-10 flex items-center justify-center rounded-full border border-app-accent/30 bg-surface-secondary p-6"
        onPress={() => setIsOpen(true)}
      >
        <Plus color="#a9c7ff" size={24} strokeWidth={1.6} />
      </TouchableOpacity>
      <StepConfirmButton onNextStep={onNextStep} />
      <CategoryDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSaved={() => updateCategoriesList()}
      />
    </>
  );
}
