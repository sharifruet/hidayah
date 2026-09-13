import { ReactNode } from 'react';
import { ScrollView, View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenProps extends ViewProps {
  children: ReactNode;
  scroll?: boolean;
  className?: string;
  contentClassName?: string;
}

/** Base screen container: bg + safe-area-aware padding. Use `scroll` for scrollable content. */
export function Screen({ children, scroll = true, className = '', contentClassName = '', ...rest }: ScreenProps) {
  const insets = useSafeAreaInsets();

  if (!scroll) {
    return (
      <View
        className={`flex-1 bg-ink-50 dark:bg-ink-950 ${className}`}
        style={{ paddingTop: insets.top }}
        {...rest}
      >
        {children}
      </View>
    );
  }

  return (
    <View className={`flex-1 bg-ink-50 dark:bg-ink-950 ${className}`} {...rest}>
      <ScrollView
        style={{ paddingTop: insets.top }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 128 }}
        className={contentClassName}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}
