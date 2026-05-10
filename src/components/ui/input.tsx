import { cn } from '@/libs/utils';
import { Text, TextInput, TextInputProps, View } from 'react-native';
interface InputProps extends TextInputProps {
  label?: string;
}
export function Input({ label, className, ...props }: InputProps) {
  return (
    <View className={cn('flex w-full flex-col gap-2', className)}>
      {label && (
        <Text
          className="text-base  text-text-primary/65"
          style={{ fontFamily: 'Sora_400Regular' }}
        >
          {label}
        </Text>
      )}
      <TextInput
        {...props}
        style={{ fontFamily: 'Sora_400Regular' }}
        className={cn(
          'h-14 w-full rounded-lg border  border-border-default bg-input-primary px-5 text-base  text-text-primary',
          'placeholder:text-text-secondary'
        )}
      />
    </View>
  );
}
