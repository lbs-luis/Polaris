import { StepConfirmButton } from '@/components/onboarding/step-confirm-button';
import { StepHeader } from '@/components/onboarding/step-header';
import {
  ICategoriesTRow,
  useCategoriesTable,
} from '@/database/tables/categories.table';
import { IRenderStepProps } from '@/interfaces/onboarding.types';
import { cn } from '@/libs/utils';
import { Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';

interface CategoryTypeButtonProps extends TouchableOpacityProps {
  selected: boolean;
  onSelect: () => void;
}
function CategoryTypeButton({
  selected,
  className,
  children,
  onSelect,
  ...props
}: CategoryTypeButtonProps) {
  return (
    <TouchableOpacity
      {...props}
      onPress={onSelect}
      className={cn(
        'flex h-16 flex-1 items-center justify-center rounded-lg',
        selected ? 'bg-primary-bg-foreground' : 'bg-secondary-bg-foreground',
        className
      )}
    >
      <Text
        className={cn(
          'text-xl font-semibold',
          selected ? 'text-primary-text' : 'text-secondary-text'
        )}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const CategoryBadge = ({ label }: { label: string }) => (
  <View className="items-center justify-center self-start rounded-full border border-primary-text/20 bg-secondary-bg px-4 py-2">
    <Text className="text-base font-normal text-primary-text">{label}</Text>
  </View>
);

export default function CategoryStep({ onNextStep }: IRenderStepProps) {
  const { set, list } = useCategoriesTable();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [categoryType, setCategoryType] = useState<'income' | 'outcome'>(
    'outcome'
  );
  const [category, setCategory] = useState<string>('');
  const [categoryList, setCategoryList] = useState<ICategoriesTRow[]>([]);

  useEffect(() => {
    async function updateCategoriesList() {
      const newCategoriesList = await list();
      setCategoryList(newCategoriesList);
    }

    if (!isSaving) updateCategoriesList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaving]);

  async function handleSaveCategory() {
    setIsSaving(true);
    await set({ name: category, type: categoryType });
    setCategory('');
    setIsSaving(false);
  }

  return (
    <>
      <StepHeader>Receita e Despesa</StepHeader>
      <View className="mt-6 flex w-full flex-row gap-2 rounded-xl bg-secondary-bg p-2">
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
      <View className="mt-4 flex h-20 w-full flex-row gap-2">
        <TextInput
          keyboardType="default"
          value={category}
          onChangeText={setCategory}
          className={cn(
            'flex-1 rounded-xl bg-secondary-bg px-6 py-5 text-2xl font-normal text-primary-text',
            'placeholder:text-primary-text/50',
            isSaving ? 'opacity-50' : 'opacity-100'
          )}
          placeholder="ex: Salário"
        />
        <TouchableOpacity
          disabled={category.length <= 1 || isSaving}
          onPress={handleSaveCategory}
          className={cn(
            'w-[24%] items-center justify-center rounded-xl bg-primary-bg-foreground',
            category.length <= 1 || isSaving ? 'opacity-50' : 'opacity-100'
          )}
        >
          <Plus size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
      <View className="mt-6 flex w-full flex-col gap-2">
        <Text className="text-xl font-normal text-primary-text">Receitas</Text>
        <View className="flex w-full flex-row flex-wrap gap-2">
          {categoryList
            .filter((item) => item.type === 'income')
            .map((item) => (
              <CategoryBadge label={item.name} key={item.id} />
            ))}
        </View>
      </View>
      <View className="mt-6 flex w-full flex-col gap-2">
        <Text className="text-xl font-normal text-primary-text">Despesas</Text>
        <View className="flex w-full flex-row flex-wrap gap-2">
          {categoryList
            .filter((item) => item.type === 'outcome')
            .map((item) => (
              <CategoryBadge label={item.name} key={item.id} />
            ))}
        </View>
      </View>

      <StepConfirmButton onNextStep={onNextStep} />
    </>
  );
}
