import { CameraIcon, PlusIcon } from 'phosphor-react-native';
import { Pressable, Text, View } from 'react-native';

interface QuickActionsProps {
  onScan: () => void;
  onAdd: () => void;
}

export function QuickActions({ onScan, onAdd }: QuickActionsProps) {
  return (
    <View className="mt-3 flex-row gap-2.5">
      <Pressable onPress={onScan} className="flex-1">
        <View
          className="flex-row items-center gap-2.5 rounded-2xl bg-white px-3.5 py-3.5"
          style={{
            shadowColor: '#FFFFFF',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.1,
            shadowRadius: 18,
            elevation: 4,
          }}
        >
          <CameraIcon size={20} color="#000000" weight="bold" />
          <Text
            className="text-[13px] text-black"
            style={{ fontFamily: 'Sora_700Bold' }}
          >
            Escanear nota
          </Text>
        </View>
      </Pressable>
      <Pressable onPress={onAdd} className="flex-1">
        <View className="flex-row items-center gap-2.5 rounded-2xl border border-border-subtle bg-surface px-3.5 py-3.5">
          <PlusIcon size={20} color="#FFFFFF" weight="bold" />
          <Text
            className="text-[13px] text-text"
            style={{ fontFamily: 'Sora_700Bold' }}
          >
            Adicionar
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
