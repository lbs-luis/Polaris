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
        'flex flex-1 items-center justify-center rounded-lg py-3',
        selected ? 'bg-app-accent' : 'bg-transparent',
        className
      )}
    >
      <Text
        className={cn(
          'text-base font-semibold uppercase',
          selected ? 'text-app-accent-muted' : 'text-text-secondary'
        )}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}
