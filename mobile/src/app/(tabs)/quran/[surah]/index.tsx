import { useLocalSearchParams } from 'expo-router';
import { ReaderScreen } from '../../../../components/quran/ReaderScreen';

export default function SurahReaderScreen() {
  const { surah } = useLocalSearchParams<{ surah: string }>();
  return <ReaderScreen surahNumber={Number(surah)} />;
}
