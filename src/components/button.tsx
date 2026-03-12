import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends TouchableOpacityProps {
  text?: string;
}

export function Button({ text, className, children, ...props }: ButtonProps) {
  return (
    <TouchableOpacity
      className={twMerge(
        'flex items-center justify-center rounded-md bg-black px-4 py-2',
        className
      )}
      {...props}
    >
      {text && (
        <Text className="flex text-lg font-bold text-white">{text}</Text>
      )}
      {children && children}
    </TouchableOpacity>
  );
}
