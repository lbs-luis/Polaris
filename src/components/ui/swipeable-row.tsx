import { PencilSimpleIcon, TrashIcon } from 'phosphor-react-native';
import { PropsWithChildren } from 'react';
import { Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

interface ActionProps {
  onPress: () => void;
}

function EditAction({ onPress }: ActionProps) {
  return (
    <Pressable onPress={onPress} className="w-24 pl-2">
      <View className="h-full flex-1 flex-row items-center justify-center gap-1.5 rounded-tile bg-[#1B2A55]">
        <PencilSimpleIcon size={16} color="#7AB4FF" weight="bold" />
        <Text
          className="text-sm text-[#7AB4FF]"
          style={{ fontFamily: 'Sora_700Bold' }}
        >
          Editar
        </Text>
      </View>
    </Pressable>
  );
}

function DeleteAction({ onPress }: ActionProps) {
  return (
    <Pressable onPress={onPress} className="w-24 pr-2">
      <View className="h-full flex-1 flex-row items-center justify-center gap-1.5 rounded-tile bg-[#3B1414]">
        <TrashIcon size={16} color="#FF4D4D" weight="bold" />
        <Text
          className="text-sm text-outcome"
          style={{ fontFamily: 'Sora_700Bold' }}
        >
          Excluir
        </Text>
      </View>
    </Pressable>
  );
}

interface SwipeableRowProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export function SwipeableRow({
  children,
  onEdit,
  onDelete,
}: PropsWithChildren<SwipeableRowProps>) {
  return (
    <Swipeable
      containerStyle={{ overflow: 'visible' }}
      renderLeftActions={
        onEdit ? () => <EditAction onPress={onEdit} /> : undefined
      }
      renderRightActions={
        onDelete ? () => <DeleteAction onPress={onDelete} /> : undefined
      }
    >
      {children}
    </Swipeable>
  );
}
