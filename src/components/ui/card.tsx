import { cn } from '@/libs/utils';
import { PropsWithChildren } from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  className?: string;
}

export function Card({
  children,
  className,
  style,
  ...rest
}: PropsWithChildren<CardProps>) {
  return (
    <View
      {...rest}
      style={style}
      className={cn('rounded-card bg-surface p-5', className)}
    >
      {children}
    </View>
  );
}
