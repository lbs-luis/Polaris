import { cn } from '@/libs/utils';
import { Text, TextInput, TextInputProps, View } from 'react-native';
interface InputProps extends TextInputProps {
  label: string;
}
export function Input({ label, ...props }: InputProps) {
  return (
    <View className="mt-12 flex w-full flex-col gap-2">
      <Text
        className="text-base uppercase text-text-primary/65"
        style={{ fontFamily: 'Sora_400Regular' }}
      >
        {label}
      </Text>
      <TextInput
        {...props}
        style={{ fontFamily: 'Sora_400Regular' }}
        className={cn(
          'w-full rounded-2xl border  border-border-default bg-input-primary px-5 py-5 text-lg  text-text-primary',
          'placeholder:text-text-secondary'
        )}
      />
    </View>
  );
}
