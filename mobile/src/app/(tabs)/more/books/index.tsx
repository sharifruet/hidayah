import { useState } from 'react';
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Screen } from '../../../../components/ui/Screen';
import { booksService, type Book } from '../../../../lib/services/books';
import { useApp } from '../../../../context/AppContext';
import { tr } from '../../../../data/translations';

export default function BooksListScreen() {
  const { language } = useApp();
  const [q, setQ] = useState('');
  const { data, isLoading, isError } = useQuery({
    queryKey: ['books', q],
    queryFn: () => booksService.listBooks({ q: q || undefined, limit: 50 }),
  });

  const books = data?.books ?? [];

  return (
    <Screen scroll={false}>
      <View className="px-4 flex-row items-center mt-4 mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1">
          <Ionicons name="chevron-back" size={22} color="#5b6579" />
        </TouchableOpacity>
        <Text className="font-body-bold text-2xl text-ink-900 dark:text-white">{tr('books_title', language)}</Text>
      </View>

      <View className="px-4 mb-4">
        <View className="flex-row items-center bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl px-3 py-2.5">
          <Ionicons name="search" size={15} color="#7d879a" />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder={tr('books_search', language)}
            placeholderTextColor="#7d879a"
            className="flex-1 ml-2 font-body text-sm text-ink-900 dark:text-white"
          />
        </View>
      </View>

      {isError ? <Text className="font-body text-sm text-red-500 px-4 mb-2">{tr('books_load_error', language)}</Text> : null}
      {isLoading ? <Text className="font-body text-sm text-ink-400 px-4">{tr('loading', language)}</Text> : null}

      <FlatList
        data={books}
        keyExtractor={(item) => item.slug}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 128 }}
        renderItem={({ item }: { item: Book }) => (
          <TouchableOpacity
            onPress={() => router.push(`/more/books/${item.slug}` as never)}
            className="flex-row bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl p-3 mb-2.5"
          >
            {item.cover_url ? (
              <Image source={{ uri: item.cover_url }} className="w-14 h-20 rounded-lg bg-ink-100" resizeMode="cover" />
            ) : (
              <View className="w-14 h-20 rounded-lg bg-primary-50 dark:bg-primary-900/30 items-center justify-center">
                <Ionicons name="book-outline" size={20} color="#22a06d" />
              </View>
            )}
            <View className="flex-1 ml-3 justify-center">
              <Text className="font-body-semibold text-sm text-ink-900 dark:text-white">{item.title}</Text>
              {item.author ? <Text className="font-body text-xs text-ink-400 mt-0.5">{item.author}</Text> : null}
              <View className="flex-row items-center mt-1.5">
                <View className="bg-ink-100 dark:bg-ink-800 px-2 py-0.5 rounded-full">
                  <Text className="font-body-medium text-[10px] text-ink-500 dark:text-ink-400 uppercase">
                    {item.content_type}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}
