import { CatIcon, isCatKind } from '@/components/ui/cat-icon';
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
      <View className="mb-2 w-full flex-row items-center gap-3 rounded-tile border border-border-subtle bg-surface px-3 py-2.5">
        {isCatKind(item.icon) && <CatIcon kind={item.icon} size={32} />}
        <Text
          className="flex-1 text-base text-text"
          style={{ fontFamily: 'Sora_600SemiBold' }}
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
          <SafeAreaView className="flex-1 items-center justify-center bg-black/60 p-6">
            <View
              className="w-full rounded-card border border-border-subtle bg-surface-2 p-5"
              style={{ maxHeight: '60%' }}
            >
              <Label
                label="Selecione uma categoria"
                uppercase={false}
                className="mb-3 text-base text-text"
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
          'flex h-14 w-full justify-center rounded-tile border border-border bg-surface-2 px-4',
          className
        )}
      >
        <Text
          className="text-base text-text"
          style={{ fontFamily: 'Sora_600SemiBold' }}
        >
          {selected ? selected.name : 'Selecione'}
        </Text>
      </TouchableOpacity>
    </>
  );
}
