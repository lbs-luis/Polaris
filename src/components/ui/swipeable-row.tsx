import {
  leftActionRadiusClass,
  rightActionRadiusClass,
} from '@/libs/list-radius';
import { cn } from '@/libs/utils';
import { PencilSimpleIcon, TrashIcon } from 'phosphor-react-native';
import { PropsWithChildren } from 'react';
import { Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

interface ActionProps {
  onPress: () => void;
  radiusClass: string;
}

function EditAction({ onPress, radiusClass }: ActionProps) {
  return (
    <Pressable onPress={onPress} className="">
      <View
        className={cn(
          'h-full w-24 flex-1 items-center justify-center gap-1 bg-[#1B2A55]',
          radiusClass
        )}
      >
        <PencilSimpleIcon size={18} color="#7AB4FF" weight="bold" />
        <Text
          className="text-[11px] text-[#7AB4FF]"
          style={{ fontFamily: 'Sora_700Bold' }}
        >
          Editar
        </Text>
      </View>
    </Pressable>
  );
}

function DeleteAction({ onPress, radiusClass }: ActionProps) {
  return (
    <Pressable onPress={onPress} className="">
      <View
        className={cn(
          'h-full w-24 flex-1 items-center justify-center gap-1 bg-[#3B1414]',
          radiusClass
        )}
      >
        <TrashIcon size={18} color="#FF4D4D" weight="bold" />
        <Text
          className="text-[11px] text-outcome"
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
  /**
   * Position of this row within its parent list. When provided, the
   * Editar / Excluir action buttons round their outer corners to match
   * the parent Card so the swipe-reveal stays flush with the rounded
   * edge instead of showing a sharp action corner inside the curve.
   */
  index?: number;
  total?: number;
}

export function SwipeableRow({
  children,
  onEdit,
  onDelete,
  index,
  total,
}: PropsWithChildren<SwipeableRowProps>) {
  const hasPosition = index !== undefined && total !== undefined;
  const leftRadius = hasPosition
    ? leftActionRadiusClass(index, total)
    : 'rounded-tile';
  const rightRadius = hasPosition
    ? rightActionRadiusClass(index, total)
    : 'rounded-tile';

  return (
    <Swipeable
      containerStyle={{ overflow: 'hidden' }}
      renderLeftActions={
        onEdit
          ? () => <EditAction onPress={onEdit} radiusClass={leftRadius} />
          : undefined
      }
      renderRightActions={
        onDelete
          ? () => <DeleteAction onPress={onDelete} radiusClass={rightRadius} />
          : undefined
      }
    >
      {children}
    </Swipeable>
  );
}
