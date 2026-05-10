import { Label } from '@/components/ui/label';
import { ICategoriesTRow } from '@/database/tables/categories.table';
import { cn } from '@/libs/utils';
import { useState } from 'react';
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CategorySelectProps {
  list: ICategoriesTRow[];
  onSelect: (selected: ICategoriesTRow | undefined) => void;
  selected: ICategoriesTRow | undefined;
  className?: string;
}
export function CategorySelect({
  list,
  onSelect,
  selected,
  className,
}: CategorySelectProps) {
  const [open, setOpen] = useState(false);

  function handleToggleOpen() {
    setOpen((prev) => !prev);
  }

  function handleSelect(item: ICategoriesTRow) {
    onSelect(item);
    handleToggleOpen();
  }

  const CategoryRow = ({ item }: { item: ICategoriesTRow }) => (
    <TouchableOpacity onPress={() => handleSelect(item)}>
      <View className="mb-2.5 flex w-full rounded-md border border-border-default/10 bg-surface-primary/80  p-3">
        <Text
          className="text-base text-text-primary"
          style={{ fontFamily: 'Sora_400Regular' }}
        >
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Modal visible={open} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={handleToggleOpen}>
          <SafeAreaView className="flex-1 items-center justify-center bg-black/50 p-6">
            <View
              className="flex w-full flex-col gap-4 rounded-lg bg-surface-secondary p-4"
              style={{ maxHeight: '60%' }}
            >
              <Label
                label="Selecione uma categoria"
                uppercase={false}
                className="text-base text-text-primary/80"
              />
              <FlatList
                data={list}
                renderItem={({ item }) => <CategoryRow item={item} />}
                keyExtractor={(item, i) => `${item.id}-${i}`}
                directionalLockEnabled={true}
              />
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Modal>

      <TouchableOpacity
        onPress={handleToggleOpen}
        className={cn(
          'flex h-14 w-full justify-center rounded-lg border border-border-default bg-input-primary px-4',
          className
        )}
      >
        <Text
          className="text-base text-text-primary"
          style={{ fontFamily: 'Sora_400Regular' }}
        >
          {selected ? selected.name : 'Selecione'}
        </Text>
      </TouchableOpacity>
    </>
  );
}
