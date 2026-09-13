import { Image, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Screen } from '../../../../../components/ui/Screen';
import { Card } from '../../../../../components/ui/Card';
import { booksService } from '../../../../../lib/services/books';
import { useApp } from '../../../../../context/AppContext';
import { tr } from '../../../../../data/translations';

export default function BookDetailScreen() {
  const { language } = useApp();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: book, isLoading } = useQuery({
    queryKey: ['book', slug],
    queryFn: () => booksService.getBook(slug),
  });

  return (
    <Screen>
      <View className="flex-row items-center mt-4 mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1">
          <Ionicons name="chevron-back" size={22} color="#5b6579" />
        </TouchableOpacity>
        <Text className="font-body-bold text-lg text-ink-900 dark:text-white flex-1" numberOfLines={1}>
          {book?.title ?? tr('more_books', language)}
        </Text>
      </View>

      {isLoading ? <Text className="font-body text-sm text-ink-400">{tr('loading', language)}</Text> : null}

      {book ? (
        <>
          <View className="flex-row mb-5">
            {book.cover_url ? (
              <Image source={{ uri: book.cover_url }} className="w-28 h-40 rounded-xl bg-ink-100" resizeMode="cover" />
            ) : (
              <View className="w-28 h-40 rounded-xl bg-primary-50 dark:bg-primary-900/30 items-center justify-center">
                <Ionicons name="book-outline" size={28} color="#22a06d" />
              </View>
            )}
            <View className="flex-1 ml-4 justify-center">
              <Text className="font-body-bold text-lg text-ink-900 dark:text-white">{book.title}</Text>
              {book.title_ar ? <Text className="font-arabic text-base text-ink-500 mt-1">{book.title_ar}</Text> : null}
              {book.author ? (
                <Text className="font-body text-sm text-ink-500 mt-2">{tr('books_by', language)} {book.author}</Text>
              ) : null}
              {book.translator ? (
                <Text className="font-body text-xs text-ink-400 mt-0.5">{tr('books_translated_by', language)} {book.translator}</Text>
              ) : null}
            </View>
          </View>

          {book.description ? (
            <Card className="p-4 mb-5">
              <Text className="font-body text-sm text-ink-600 dark:text-ink-300 leading-relaxed">{book.description}</Text>
            </Card>
          ) : null}

          <View className="flex-row flex-wrap gap-2 mb-6">
            {book.publisher ? (
              <View className="bg-ink-100 dark:bg-ink-800 px-2.5 py-1 rounded-full">
                <Text className="font-body text-xs text-ink-500 dark:text-ink-400">{book.publisher}</Text>
              </View>
            ) : null}
            {book.published_year ? (
              <View className="bg-ink-100 dark:bg-ink-800 px-2.5 py-1 rounded-full">
                <Text className="font-body text-xs text-ink-500 dark:text-ink-400">{book.published_year}</Text>
              </View>
            ) : null}
            {book.page_count ? (
              <View className="bg-ink-100 dark:bg-ink-800 px-2.5 py-1 rounded-full">
                <Text className="font-body text-xs text-ink-500 dark:text-ink-400">{book.page_count} {tr('books_pages', language)}</Text>
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={() => router.push(`/more/books/${slug}/read` as never)}
            className="bg-primary-600 rounded-xl py-3.5 items-center flex-row justify-center"
          >
            <Ionicons name="book" size={16} color="#fff" />
            <Text className="font-body-semibold text-sm text-white ml-2">{tr('books_read_now', language)}</Text>
          </TouchableOpacity>
        </>
      ) : null}
    </Screen>
  );
}
