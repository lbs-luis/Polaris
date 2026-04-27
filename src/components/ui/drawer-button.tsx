import { cn } from '@/libs/utils';
import { Plus } from 'lucide-react-native';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface DrawerButtonProps extends TouchableOpacityProps {
  text?: string;
}

export function DrawerButton({ text, className, ...props }: DrawerButtonProps) {
  return (
    <TouchableOpacity
      {...props}
      className={cn(
        'mt-4 flex flex-row items-center justify-center gap-2 rounded-xl bg-app-accent py-4',
        className
      )}
    >
      <Plus size={14} color="#0A305F" strokeWidth={2} />
      <Text className="text-sm font-medium uppercase text-app-accent-muted">
        {text}
      </Text>
    </TouchableOpacity>
  );
}
