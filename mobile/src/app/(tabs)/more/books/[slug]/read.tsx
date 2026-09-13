import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { WebView } from 'react-native-webview';
import Pdf from 'react-native-pdf';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { booksService, type BookChapter } from '../../../../../lib/services/books';
import { getLocalBookUri, ensureBookDownloaded } from '../../../../../lib/offlineBooks';
import { useApp } from '../../../../../context/AppContext';
import { tr } from '../../../../../data/translations';

function flattenChapters(nodes: BookChapter[], depth = 0, out: { node: BookChapter; depth: number }[] = []) {
  for (const node of nodes) {
    out.push({ node, depth });
    if (node.children?.length) flattenChapters(node.children, depth + 1, out);
  }
  return out;
}

export default function BookReaderScreen() {
  const { language } = useApp();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const insets = useSafeAreaInsets();
  const [activeChapterId, setActiveChapterId] = useState<number | null>(null);
  const [tocOpen, setTocOpen] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [localPdfUri, setLocalPdfUri] = useState<string | null>(() => getLocalBookUri(slug));

  const { data: book } = useQuery({
    queryKey: ['book', slug],
    queryFn: () => booksService.getBook(slug),
    staleTime: 24 * 60 * 60 * 1000,
  });

  // Download once, then read from disk from here on — the book stays available offline.
  useEffect(() => {
    if (localPdfUri || !book?.pdf_url) return;
    let cancelled = false;
    ensureBookDownloaded(slug, book.pdf_url)
      .then((uri) => {
        if (!cancelled) setLocalPdfUri(uri);
      })
      .catch(() => {
        if (!cancelled) setPdfError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [book?.pdf_url, slug, localPdfUri]);
  const { data: chapters } = useQuery({
    queryKey: ['book-chapters', slug],
    queryFn: () => booksService.listChapters(slug),
    enabled: !book || book.content_type === 'text',
    staleTime: 24 * 60 * 60 * 1000,
  });

  const flat = useMemo(() => flattenChapters(chapters ?? []), [chapters]);
  const readable = flat.filter((f) => f.node.has_content);

  const currentId = activeChapterId ?? readable[0]?.node.id ?? null;
  const currentIdx = readable.findIndex((f) => f.node.id === currentId);

  const { data: chapter } = useQuery({
    queryKey: ['book-chapter', slug, currentId],
    queryFn: () => booksService.getChapter(slug, String(currentId)),
    enabled: currentId != null,
    staleTime: 24 * 60 * 60 * 1000,
  });

  if (book && book.content_type !== 'text') {
    // Native PDF rendering — WebView (both archive.org's own canvas-based /embed/
    // reader and Google's docs viewer wrapper) reliably fails on Android: the
    // heavy reader paints nothing, and loading a large PDF directly can ANR the
    // WebView's main-thread renderer. react-native-pdf renders off-thread instead.
    return (
      <View className="flex-1 bg-ink-950" style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center px-4 pb-3">
          <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1">
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text className="font-body-semibold text-base text-white flex-1" numberOfLines={1}>
            {book.title}
          </Text>
        </View>
        {pdfError ? (
          <View className="flex-1 items-center justify-center px-8">
            <Ionicons name="cloud-offline-outline" size={32} color="#5b6579" />
            <Text className="font-body text-sm text-ink-300 text-center mt-3">
              {tr('books_file_error', language)}
            </Text>
          </View>
        ) : localPdfUri ? (
          <Pdf
            source={{ uri: localPdfUri }}
            style={{ flex: 1, backgroundColor: '#0a0c11' }}
            renderActivityIndicator={() => <ActivityIndicator color="#fff" />}
            onError={() => setPdfError(true)}
          />
        ) : book.pdf_url ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#fff" />
          </View>
        ) : book.embed_url ? (
          <WebView source={{ uri: book.embed_url }} style={{ flex: 1 }} startInLoadingState />
        ) : (
          <Text className="font-body text-sm text-ink-300 text-center mt-10">{tr('books_no_content', language)}</Text>
        )}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-ink-50 dark:bg-ink-950" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-4 pb-3">
        <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1">
          <Ionicons name="chevron-back" size={22} color="#5b6579" />
        </TouchableOpacity>
        <Text className="font-body-semibold text-base text-ink-900 dark:text-white flex-1" numberOfLines={1}>
          {book?.title ?? tr('books_read_now', language)}
        </Text>
        <TouchableOpacity onPress={() => setTocOpen(true)} className="p-1.5">
          <Ionicons name="list" size={20} color="#5b6579" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
        {chapter?.title ? (
          <Text className="font-body-bold text-xl text-ink-900 dark:text-white mb-4">{chapter.title}</Text>
        ) : null}
        {chapter?.content ? (
          chapter.content.split('\n\n').map((para, idx) => (
            <Text key={idx} className="font-body text-base text-ink-700 dark:text-ink-300 leading-[26px] mb-4">
              {para}
            </Text>
          ))
        ) : (
          <Text className="font-body text-sm text-ink-400">{tr('books_loading_chapter', language)}</Text>
        )}
      </ScrollView>

      <View className="flex-row justify-between px-4 py-3 border-t border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900">
        <TouchableOpacity
          disabled={currentIdx <= 0}
          onPress={() => setActiveChapterId(readable[currentIdx - 1].node.id)}
          className={`flex-row items-center px-3 py-2 rounded-lg ${currentIdx <= 0 ? 'opacity-30' : ''}`}
        >
          <Ionicons name="chevron-back" size={16} color="#5b6579" />
          <Text className="font-body-medium text-sm text-ink-600 dark:text-ink-300 ml-1">{tr('books_prev', language)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={currentIdx === -1 || currentIdx >= readable.length - 1}
          onPress={() => setActiveChapterId(readable[currentIdx + 1].node.id)}
          className={`flex-row items-center px-3 py-2 rounded-lg ${
            currentIdx === -1 || currentIdx >= readable.length - 1 ? 'opacity-30' : ''
          }`}
        >
          <Text className="font-body-medium text-sm text-ink-600 dark:text-ink-300 mr-1">{tr('books_next', language)}</Text>
          <Ionicons name="chevron-forward" size={16} color="#5b6579" />
        </TouchableOpacity>
      </View>

      <Modal visible={tocOpen} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setTocOpen(false)}>
        <View className="flex-1 bg-white dark:bg-ink-950" style={{ paddingTop: insets.top + 8 }}>
          <View className="flex-row items-center justify-between px-4 mb-3">
            <Text className="font-body-bold text-lg text-ink-900 dark:text-white">{tr('books_contents', language)}</Text>
            <TouchableOpacity onPress={() => setTocOpen(false)}>
              <Ionicons name="close" size={24} color="#5b6579" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
            {flat.map(({ node, depth }) => (
              <TouchableOpacity
                key={node.id}
                disabled={!node.has_content}
                onPress={() => {
                  setActiveChapterId(node.id);
                  setTocOpen(false);
                }}
                style={{ paddingLeft: depth * 16 }}
                className="py-2.5 border-b border-ink-100 dark:border-ink-800"
              >
                <Text
                  className={`font-body-medium text-sm ${
                    node.has_content ? 'text-ink-800 dark:text-ink-200' : 'text-ink-400'
                  } ${node.id === currentId ? 'text-primary-600 dark:text-primary-400' : ''}`}
                >
                  {node.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
