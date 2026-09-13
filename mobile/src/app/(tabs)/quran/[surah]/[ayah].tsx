import { useLocalSearchParams } from 'expo-router';
import { ReaderScreen } from '../../../../components/quran/ReaderScreen';

export default function SurahReaderAtAyahScreen() {
  const { surah, ayah } = useLocalSearchParams<{ surah: string; ayah: string }>();
  return <ReaderScreen surahNumber={Number(surah)} initialAyah={Number(ayah)} />;
}
