import { useCategoriesTable } from '@/database/tables/categories.table';
import { cn } from '@/libs/utils';
import { Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
  const { set } = useCategoriesTable();

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

  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const translateY = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    if (isOpen) {
      translateY.value = withSpring(0);
    } else {
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 120 });
    }
  }, [SCREEN_HEIGHT, isOpen, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal
      visible={isOpen}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <KeyboardAvoidingView
          behavior={'padding'}
          className="flex flex-1 justify-end"
          keyboardVerticalOffset={-insets.bottom}
        >
          <Animated.View
            style={[animatedStyle, { paddingBottom: insets.bottom + 24 }]}
            className="flex w-full flex-col rounded-tl-3xl rounded-tr-3xl bg-surface-secondary p-6"
          >
            <Text className="text-xl font-medium text-text-secondary">
              Nova Categoria
            </Text>
            <TextInput
              value={category}
              onChangeText={setCategory}
              editable={!isSaving}
              className={cn(
                'mt-4 w-full rounded-lg bg-input-primary p-4 text-base font-normal text-text-primary ',
                'placeholder:text-text-secondary',
                isSaving ? 'opacity-50' : 'opacity-100'
              )}
              placeholder="Uber, Assinaturas, Streamings, ..."
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
            <TouchableOpacity
              disabled={category.length <= 1 || isSaving}
              onPress={handleSave}
              className={cn(
                'mt-4 flex flex-row items-center justify-center gap-2 rounded-xl bg-app-accent py-4',
                category.length <= 1 || isSaving ? 'opacity-50' : 'opacity-100'
              )}
            >
              <Plus size={14} color="#0A305F" />
              <Text className="text-sm font-semibold uppercase text-app-accent-muted">
                adicionar nova categoria
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
