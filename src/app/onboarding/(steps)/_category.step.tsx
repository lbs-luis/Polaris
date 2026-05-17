import { KeyboardView } from '@/components/layout/keyboard-view.layout';
import { OnboardingFooter } from '@/components/layout/onboarding/onboarding-footer.layout';
import { AddCategoryForm } from '@/components/onboarding/category/add-category-form';
import { StepHeader } from '@/components/onboarding/step-header';
import { Card } from '@/components/ui/card';
import { CatIcon, isCatKind } from '@/components/ui/cat-icon';
import { Label } from '@/components/ui/label';
import { SwipeableRow } from '@/components/ui/swipeable-row';
import { useBottomSheetContext } from '@/context/bottomsheet.context';
import { ICategoriesTRow } from '@/database/tables/categories.table';
import { useCategoryStep } from '@/hooks/view-models/use-category-step';
import { IRenderStepProps } from '@/interfaces/onboarding.types';
import { rowRadiusClass } from '@/libs/list-radius';
import { cn } from '@/libs/utils';
import { CaretRightIcon, PlusIcon } from 'phosphor-react-native';
import { Pressable, Text, View } from 'react-native';

function CategoryRow({
  item,
  index,
  total,
  onEdit,
  onDelete,
}: {
  item: ICategoriesTRow;
  index: number;
  total: number;
  onEdit?: (item: ICategoriesTRow) => void;
  onDelete?: (name: string) => void;
}) {
  return (
    <SwipeableRow
      index={index}
      total={total}
      onEdit={onEdit ? () => onEdit(item) : undefined}
      onDelete={onDelete ? () => onDelete(item.name) : undefined}
    >
      <View
        className={`flex-row items-center gap-3 bg-surface px-3 py-2.5 ${rowRadiusClass(index, total)} ${index === 0 ? '' : 'border-t border-border-subtle'}`}
      >
        {isCatKind(item.icon) ? (
          <CatIcon kind={item.icon} size={36} />
        ) : (
          <View className="h-9 w-9 items-center justify-center rounded-tile bg-surface-2">
            <Text
              className="text-sm text-text"
              style={{ fontFamily: 'Sora_700Bold' }}
            >
              {item.name.slice(0, 1).toUpperCase()}
            </Text>
          </View>
        )}
        <Text
          className="flex-1 text-sm text-text"
          style={{ fontFamily: 'Sora_600SemiBold' }}
        >
          {item.name}
        </Text>
        <CaretRightIcon size={16} color="#5E5E66" weight="bold" />
      </View>
    </SwipeableRow>
  );
}

function CategoryGroup({
  title,
  tone,
  items,
  onEdit,
  onDelete,
}: {
  title: string;
  tone: 'income' | 'outcome';
  items: ICategoriesTRow[];
  onEdit: (item: ICategoriesTRow) => void;
  onDelete: (name: string) => void;
}) {
  const dotColor = tone === 'income' ? 'bg-income' : 'bg-outcome';
  return (
    <View className="mt-6">
      <View className="flex-row items-center gap-2 px-1 pb-2">
        <View className={`h-2 w-2 rounded-full ${dotColor}`} />
        <Label label={title} className="text-xs text-text" />
        <View className="h-px flex-1 bg-border-subtle" />
        <Text
          className="text-xs text-text-mute"
          style={{ fontFamily: 'Sora_600SemiBold' }}
        >
          {items.length}
        </Text>
      </View>
      <Card className={cn('p-0', items.length > 0 ? 'flex' : 'hidden')}>
        {items.map((c, i) => (
          <CategoryRow
            key={c.id}
            item={c}
            index={i}
            total={items.length}
            onEdit={c.isDefault ? undefined : onEdit}
            onDelete={c.isDefault ? undefined : onDelete}
          />
        ))}
      </Card>
    </View>
  );
}

function AddCategoryCTA({
  tone,
  onPress,
}: {
  tone: 'income' | 'outcome';
  onPress: () => void;
}) {
  const color = tone === 'income' ? '#3CC85F' : '#FF4D4D';
  return (
    <Pressable
      onPress={onPress}
      className="mt-3 flex-row items-center gap-3 rounded-card border-[1.5px] border-dashed border-border px-4 py-3.5"
    >
      <View className="h-10 w-10 items-center justify-center rounded-tile bg-surface-2">
        <PlusIcon size={20} color={color} weight="bold" />
      </View>
      <Text className="text-sm" style={{ fontFamily: 'Sora_700Bold', color }}>
        Criar nova categoria
      </Text>
    </Pressable>
  );
}

export default function CategoryStep({
  onNextStep,
  onPreviousStep,
  isFirstStep,
}: IRenderStepProps) {
  const { incomes, outcomes, handleDelete, refresh } = useCategoryStep();
  const { openBottomSheet, closeBottomSheet } = useBottomSheetContext();

  async function handleOnSaved() {
    closeBottomSheet();
    await refresh();
  }

  function openAddSheet(type: 'income' | 'outcome') {
    openBottomSheet(
      <AddCategoryForm defaultSelected={type} onSaved={handleOnSaved} />,
      { title: 'Nova categoria' }
    );
  }

  function openEditSheet(item: ICategoriesTRow) {
    openBottomSheet(
      <AddCategoryForm
        defaultSelected={item.type}
        category={item}
        onSaved={handleOnSaved}
      />,
      { title: 'Editar categoria' }
    );
  }

  return (
    <>
      <KeyboardView className="px-6 pb-4">
        <StepHeader
          title={`Suas\ncategorias.`}
          description="Organize por tipo. Você pode criar, renomear e remover quando quiser."
        />

        <CategoryGroup
          title="Entradas"
          tone="income"
          items={incomes}
          onEdit={openEditSheet}
          onDelete={handleDelete}
        />
        <AddCategoryCTA tone="income" onPress={() => openAddSheet('income')} />

        <CategoryGroup
          title="Saídas"
          tone="outcome"
          items={outcomes}
          onEdit={openEditSheet}
          onDelete={handleDelete}
        />
        <AddCategoryCTA
          tone="outcome"
          onPress={() => openAddSheet('outcome')}
        />

        <View className="h-6" />
      </KeyboardView>

      <OnboardingFooter
        onContinue={onNextStep}
        onBack={onPreviousStep}
        showBack={!isFirstStep}
      />
    </>
  );
}
