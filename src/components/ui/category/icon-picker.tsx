import { CAT_KINDS, CatIcon, CatKind } from '@/components/ui/cat-icon';
import { Label } from '@/components/ui/label';
import { Pressable, View } from 'react-native';

interface IconPickerProps {
  value: CatKind | null;
  onChange: (kind: CatKind) => void;
  className?: string;
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  return (
    <View className={className}>
      <Label label="Ícone" uppercase={false} />
      <View className="mt-2 flex-row flex-wrap items-center justify-center gap-2">
        {CAT_KINDS.map((kind) => {
          const isSelected = value === kind;
          return (
            <Pressable
              key={kind}
              onPress={() => onChange(kind)}
              className={`rounded-tile border-[1.5px] p-3  ${
                isSelected
                  ? 'border-brand bg-surface-3'
                  : 'border-border-subtle bg-surface-2'
              }`}
            >
              <CatIcon kind={kind} size={28} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
