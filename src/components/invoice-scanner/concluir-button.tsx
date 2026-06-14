import { cn } from '@/libs/utils';
import { Pressable, Text, View } from 'react-native';

interface ConcluirButtonProps {
  disabled?: boolean;
  onPress: () => void;
}

export function ConcluirButton({ disabled, onPress }: ConcluirButtonProps) {
  return (
    <Pressable onPress={disabled ? undefined : onPress}>
      <View
        className={cn(
          'flex-row items-center justify-center gap-1.5 rounded-[26px] bg-white px-5',
          disabled && 'opacity-40'
        )}
        style={{
          minWidth: 99,
          height: 52,
          shadowColor: '#FFFFFF',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.18,
          shadowRadius: 22,
          elevation: 8,
        }}
      >
        <Text
          className="text-[14px] text-black"
          style={{ fontFamily: 'Sora_700Bold' }}
        >
          Concluir
        </Text>
      </View>
    </Pressable>
  );
}
