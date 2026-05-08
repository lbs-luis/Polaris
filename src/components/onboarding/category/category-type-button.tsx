import { cn } from '@/libs/utils';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface CategoryTypeButtonProps extends TouchableOpacityProps {
  selected: boolean;
  onSelect: () => void;
}
export function CategoryTypeButton({
  selected,
  className,
  children,
  onSelect,
  ...props
}: CategoryTypeButtonProps) {
  return (
    <TouchableOpacity
      {...props}
      onPress={onSelect}
      className={cn(
        'flex flex-1 items-center justify-center rounded-lg border bg-transparent py-3',
        selected ? 'border-button-primary/80' : 'border-transparent',
        className
      )}
    >
      <Text
        className={cn(
          'text-base',
          selected ? 'text-text-primary' : 'text-text-secondary'
        )}
        style={{ fontFamily: 'Sora_400Regular' }}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}
