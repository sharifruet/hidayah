import { ReactNode } from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '', ...rest }: CardProps) {
  return (
    <View
      className={`bg-white dark:bg-ink-900 rounded-2xl border border-ink-100 dark:border-ink-800 ${className}`}
      {...rest}
    >
      {children}
    </View>
  );
}
