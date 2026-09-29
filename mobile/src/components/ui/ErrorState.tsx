import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useApp } from '../../context/AppContext';
import { tr } from '../../data/translations';
import { userErrorMessage } from '../../lib/errors';

/**
 * Friendly failed-to-load message with a retry button. `compact` renders a single row
 * for use inside cards/lists; otherwise it's a centred block.
 */
export function ErrorState({
  error,
  onRetry,
  retrying = false,
  compact = false,
  className = '',
}: {
  error?: unknown;
  onRetry?: () => void;
  retrying?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const { language } = useApp();
  const message = userErrorMessage(error, language);
  const offline = (error as { code?: string } | undefined)?.code === 'NETWORK_ERROR';

  const retryButton = onRetry ? (
    <TouchableOpacity
      onPress={onRetry}
      disabled={retrying}
      className="flex-row items-center bg-primary-600 rounded-full px-4 py-2"
      accessibilityRole="button"
    >
      {retrying ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="refresh" size={14} color="#fff" />}
      <Text className="font-body-semibold text-xs text-white ml-1.5">{tr('error_retry', language)}</Text>
    </TouchableOpacity>
  ) : null;

  if (compact) {
    return (
      <View className={`flex-row items-center bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900 rounded-xl px-3 py-2.5 ${className}`}>
        <Ionicons name={offline ? 'cloud-offline-outline' : 'alert-circle-outline'} size={16} color="#e11d48" />
        <Text className="font-body text-xs text-rose-700 dark:text-rose-300 flex-1 mx-2">{message}</Text>
        {retryButton}
      </View>
    );
  }

  return (
    <View className={`items-center px-6 py-10 ${className}`}>
      <Ionicons name={offline ? 'cloud-offline-outline' : 'alert-circle-outline'} size={32} color="#7d879a" />
      <Text className="font-body-semibold text-base text-ink-900 dark:text-white mt-3">{tr('error_title', language)}</Text>
      <Text className="font-body text-sm text-ink-500 dark:text-ink-400 text-center mt-1 mb-4">{message}</Text>
      {retryButton}
    </View>
  );
}
